import type { Metadata } from "next";
import { SettingsForm } from "@/features/modules/settings-form";
import { PageHeader } from "@/features/shell/page-header";

export const metadata: Metadata = { title: "Store settings" };

export default function Page() {
  return (
    <>
      <PageHeader
        title="Store settings"
        description="Demo settings saved in this browser. They are not applied to the storefront."
      />
      <SettingsForm />
    </>
  );
}
