import dynamic from "next/dynamic";
const Expenses = dynamic(() => import("@/components/Expenses"), { ssr: false });
