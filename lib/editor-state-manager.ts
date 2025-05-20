import { Editor } from "@tiptap/react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { debounce } from "lodash";

export interface EditorState {
    version: number;
    content: any;
    lastModified: number;
    userId: string;
    selection?: {
        from: number;
        to: number;
    };
}

export class EditorStateManager {
    private currentState: EditorState | null = null;
    private pendingUpdates: EditorState[] = [];
    private isInitialized: boolean = false;
    private editor: Editor | null = null;
    private channel: RealtimeChannel | null = null;
    private userId: string;
    private version: number = 0;
    private isProcessing: boolean = false;
    private retryCount: number = 0;
    private readonly maxRetries: number = 3;
    private readonly batchSize: number = 50;
    private readonly throttleDelay: number = 100;
    private stateCollectionTimeout: NodeJS.Timeout | null = null;

    constructor(userId: string) {
        this.userId = userId;
    }

    initialize(editor: Editor, channel: RealtimeChannel) {
        this.editor = editor;
        this.channel = channel;
        this.setupChannelListeners();
    }

    private setupChannelListeners() {
        if (!this.channel) return;

        // Handle user join events
        this.channel.on(
            "broadcast",
            { event: "user:join" },
            async (payload) => {
                if (payload.user_id === this.userId) {
                    // We are the new user
                    await this.handleUserJoin();
                } else {
                    // Another user joined, send our state
                    this.sendCurrentState();
                }
            },
        );

        // Handle state updates
        this.channel.on("broadcast", { event: "state:update" }, (payload) => {
            this.handleStateUpdate(payload);
        });

        // Handle state requests
        this.channel.on("broadcast", { event: "state:request" }, () => {
            this.sendCurrentState();
        });
    }

    private async handleUserJoin() {
        try {
            // Request current state from all users
            this.broadcastStateRequest();

            // Wait for state responses
            const states = await this.collectStateResponses();

            // Resolve conflicts and get latest state
            const latestState = this.resolveStateConflicts(states);

            // Initialize editor with latest state
            this.initializeEditor(latestState);
        } catch (error) {
            console.error("Error handling user join:", error);
            this.handleError(error);
        }
    }

    private broadcastStateRequest() {
        if (!this.channel) return;

        this.channel.send({
            type: "broadcast",
            event: "state:request",
            payload: {
                user_id: this.userId,
                timestamp: Date.now(),
            },
        });
    }

    private async collectStateResponses(): Promise<EditorState[]> {
        return new Promise((resolve) => {
            const states: EditorState[] = [];

            // Clear any existing timeout
            if (this.stateCollectionTimeout) {
                clearTimeout(this.stateCollectionTimeout);
            }

            // Set timeout for collection
            this.stateCollectionTimeout = setTimeout(() => {
                resolve(states);
            }, 2000);

            if (!this.channel) {
                if (this.stateCollectionTimeout) {
                    clearTimeout(this.stateCollectionTimeout);
                }
                resolve(states);
                return;
            }

            const handler = (payload: any) => {
                if (payload.event === "state:response") {
                    states.push(payload.state);
                }
            };

            // Subscribe to state responses
            this.channel.on("broadcast", { event: "state:response" }, handler);

            // Cleanup after timeout
            setTimeout(() => {
                this.channel?.off("broadcast", handler);
                if (this.stateCollectionTimeout) {
                    clearTimeout(this.stateCollectionTimeout);
                }
                resolve(states);
            }, 2000);
        });
    }

    private resolveStateConflicts(states: EditorState[]): EditorState {
        if (states.length === 0) {
            return this.getInitialState();
        }

        // Sort by version and timestamp
        const sortedStates = states.sort((a, b) => {
            if (a.version === b.version) {
                return b.lastModified - a.lastModified;
            }
            return b.version - a.version;
        });

        return sortedStates[0];
    }

    private getInitialState(): EditorState {
        return {
            version: 0,
            content: { type: "doc", content: [] },
            lastModified: Date.now(),
            userId: this.userId,
        };
    }

    private initializeEditor(state: EditorState) {
        if (!this.editor) return;

        this.currentState = state;
        this.version = state.version;
        this.isInitialized = true;

        // Apply the state to the editor
        this.editor.commands.setContent(state.content, false);

        // Process any pending updates
        this.processPendingUpdates();
    }

    private processPendingUpdates() {
        if (this.isProcessing || !this.editor || !this.isInitialized) return;

        this.isProcessing = true;

        while (this.pendingUpdates.length > 0) {
            const update = this.pendingUpdates.shift();
            if (update) {
                this.applyUpdate(update);
            }
        }

        this.isProcessing = false;
    }

    private applyUpdate(update: EditorState) {
        if (!this.editor || !this.isInitialized) return;

        // Only apply if the update is newer than our current state
        if (update.version > this.version) {
            this.editor.commands.setContent(update.content, false);
            this.version = update.version;
            this.currentState = update;
        }
    }

    private sendCurrentState() {
        if (!this.channel || !this.editor || !this.isInitialized) return;

        const state: EditorState = {
            version: this.version,
            content: this.editor.getJSON(),
            lastModified: Date.now(),
            userId: this.userId,
            selection: this.editor.state.selection,
        };

        // Send state as a response
        this.channel.send({
            type: "broadcast",
            event: "state:response",
            payload: state,
        });
    }

    private handleStateUpdate(payload: any) {
        if (!this.isInitialized) {
            this.pendingUpdates.push(payload.state);
            return;
        }

        this.applyUpdate(payload.state);
    }

    private handleError(error: any) {
        console.error("Editor state error:", error);
        this.retryCount++;

        if (this.retryCount < this.maxRetries) {
            setTimeout(() => {
                this.handleUserJoin();
            }, Math.pow(2, this.retryCount) * 1000);
        }
    }

    // Public methods for external use
    updateContent(content: any) {
        if (!this.editor || !this.isInitialized) return;

        this.version++;
        this.currentState = {
            version: this.version,
            content,
            lastModified: Date.now(),
            userId: this.userId,
            selection: this.editor.state.selection,
        };

        this.sendCurrentState();
    }

    cleanup() {
        if (this.channel) {
            this.channel.unsubscribe();
        }
        if (this.stateCollectionTimeout) {
            clearTimeout(this.stateCollectionTimeout);
        }
        this.isInitialized = false;
        this.currentState = null;
        this.pendingUpdates = [];
        this.retryCount = 0;
    }
}
