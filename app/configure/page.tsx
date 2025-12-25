import { Suspense } from "react";
import ConfigureClient from "./ConfigureClient";

export default function ConfigurePage() {
  return (
    <Suspense fallback={<div className="p-10">Loading configuration...</div>}>
      <ConfigureClient />
    </Suspense>
  );
}
