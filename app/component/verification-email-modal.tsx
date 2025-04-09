'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from '@/components/ui/modal';
import { Mail, CheckCircle } from 'lucide-react';

interface VerificationEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export function VerificationEmailModal({
  isOpen,
  onClose,
  email,
}: VerificationEmailModalProps) {
  const router = useRouter();

  const handleClose = () => {
    onClose();
    router.push('/auth/login');
  };

  return (
    <Modal open={isOpen} onOpenChange={handleClose}>
      <ModalContent className="sm:max-w-md">
        <ModalHeader className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-[#634AFF]/10 flex items-center justify-center">
            <Mail className="h-6 w-6 text-[#634AFF]" />
          </div>
          <ModalTitle className="text-xl">Verify your email</ModalTitle>
        </ModalHeader>

        <div className="p-6 text-center">
          <ModalDescription className="mb-4 text-base">
            We've sent a verification email to{' '}
            <span className="font-medium text-foreground">{email}</span>
          </ModalDescription>

          <p className="text-sm text-muted-foreground mb-6">
            Please check your inbox and click the verification link to activate
            your account. If you don't see the email, check your spam folder.
          </p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleClose}
              className="w-full bg-[#634AFF] hover:bg-[#5338FF]"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Go to login
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
