"use client";

import { createContext, useState, use } from "react";

import { PACKAGE_MANAGER } from "@/constants";

type PackageNameMap = keyof typeof PACKAGE_MANAGER;

type PackageManager = (typeof PACKAGE_MANAGER)[PackageNameMap];

type PackageNameContextType = {
  packageName: PackageManager;
  setPackageName: (packageName: PackageManager) => void;
};

const PackageNameContext = createContext<PackageNameContextType>({
  packageName: PACKAGE_MANAGER.PNPM,
  setPackageName: (_packageName: PackageManager) => {
    return;
  },
});

const PackageNameProvider = ({ children }: { children: React.ReactNode }) => {
  const [packageName, setPackageName] = useState<PackageManager>(
    PACKAGE_MANAGER.PNPM
  );

  return (
    <PackageNameContext.Provider value={{ packageName, setPackageName }}>
      {children}
    </PackageNameContext.Provider>
  );
};

const usePackageNameContext = () => {
  const context = use(PackageNameContext);

  if (!context) {
    throw new Error(
      "usePackageNameContext must be used within a PackageNameProvider"
    );
  }

  return context;
};

export { PackageNameProvider, usePackageNameContext };
