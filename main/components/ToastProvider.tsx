"use client";

import { Toaster, toast, ToastOptions } from "react-hot-toast";
import React, { ReactElement } from "react";

export interface ToastApi {
  success: (msg: string, options?: ToastOptions) => string;
  error: (msg: string, options?: ToastOptions) => string;
  loading: (msg: string, options?: ToastOptions) => string;
  dismiss: (id?: string) => void;
  custom: (
    content: ReactElement | (() => ReactElement),
    options?: ToastOptions,
  ) => string;
}

export const useToast = (): ToastApi => ({
  success: (msg, options) => toast.success(msg, options),
  error: (msg, options) => toast.error(msg, options),
  loading: (msg, options) => toast.loading(msg, options),
  dismiss: (id) => toast.dismiss(id),
  custom: (content, options) => toast(content, options),
});

export default function ToastProvider() {
  return <Toaster position="top-right" />;
}
