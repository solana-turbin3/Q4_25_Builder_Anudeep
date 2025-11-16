import { cn } from "@/lib/utils";
import {
  IconTicket,
  IconCertificate,
  IconNetwork,
  IconShieldCheck,
} from "@tabler/icons-react";

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Decentralized Attendance",
      description:
        "Create on-chain events and issue verifiable proof-of-attendance NFTs using Solana’s fast and secure infrastructure.",
      icon: <IconTicket />,
    },
    {
      title: "Voucher-Based Claims",
      description:
        "Distribute unique claim links or QR codes that mint attendance badges directly to participant wallets.",
      icon: <IconCertificate />,
    },
    {
      title: "On-Chain Verification",
      description:
        "Each badge is backed by immutable smart contracts verifiable event data stored in PDAs on Solana.",
      icon: <IconNetwork />,
    },
    {
      title: "Non-Transferable Badges",
      description:
        "Ensure authenticity by issuing soulbound badges that remain tied to the user’s wallet identity forever.",
      icon: <IconShieldCheck />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-neutral-800/50",
        (index === 0 || index === 4) && "lg:border-l",
        index < 4 && "lg:border-b"
      )}
    >
      <div className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 h-full w-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.08),transparent_70%)] pointer-events-none" />

      <div className="mb-4 relative z-10 px-10 text-emerald-400 group-hover/feature:scale-110 transition-transform duration-300">
        {icon}
      </div>

      <div className="text-lg font-semibold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-emerald-400 group-hover/feature:bg-emerald-400 transition-all duration-200 origin-center shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-100">
          {title}
        </span>
      </div>

      <p className="text-sm text-neutral-400 max-w-xs relative z-10 px-10 group-hover/feature:text-neutral-200 transition-colors duration-300">
        {description}
      </p>
    </div>
  );
};
