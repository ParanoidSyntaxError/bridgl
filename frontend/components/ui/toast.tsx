"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Clock } from "lucide-react"
import Link from "next/link"

export type ToastType = "success" | "error" | "loading" | "info"

export interface Toast {
    id: string
    type: ToastType
    title: string
    message: string
    duration?: number
    persistent?: boolean
}

interface ToastProps {
    toast: Toast
    onClose: (id: string) => void
}

interface ToastContainerProps {
    toasts: Toast[]
    onClose: (id: string) => void
}

// Individual Toast Component
export function ToastComponent({ toast, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [isExiting, setIsExiting] = useState(false)

    useEffect(() => {
        // Trigger entrance animation
        const timer = setTimeout(() => setIsVisible(true), 50)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (toast.duration && !toast.persistent) {
            const timer = setTimeout(() => {
                handleClose()
            }, toast.duration)
            return () => clearTimeout(timer)
        }
    })

    const handleClose = () => {
        setIsExiting(true)
        setTimeout(() => {
            onClose(toast.id)
        }, 300) // Match exit animation duration
    }

    const getIcon = () => {
        switch (toast.type) {
            case "success":
                return <CheckCircle className="w-5 h-5 text-green-600" />
            case "error":
                return <AlertCircle className="w-5 h-5 text-red-600" />
            case "loading":
                return <Clock className="w-5 h-5 text-blue-600 animate-spin" />
            case "info":
            default:
                return <AlertCircle className="w-5 h-5 text-gray-600" />
        }
    }

    const getBorderColor = () => {
        switch (toast.type) {
            case "success":
                return "border-green-600"
            case "error":
                return "border-red-600"
            case "loading":
                return "border-blue-600"
            case "info":
            default:
                return "border-gray-600"
        }
    }

    const getAccentColor = () => {
        switch (toast.type) {
            case "success":
                return "bg-green-600"
            case "error":
                return "bg-red-600"
            case "loading":
                return "bg-blue-600"
            case "info":
            default:
                return "bg-gray-600"
        }
    }

    return (
        <div
            className={`
        relative bg-white border-2 ${getBorderColor()} p-4 mb-3 shadow-lg
        transition-all duration-300 ease-in-out transform
        ${isVisible && !isExiting ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        ${isExiting ? "translate-x-full opacity-0" : ""}
        max-w-sm w-full
      `}
            data-testid={`toast-${toast.type}`}
            role="alert"
            aria-live="polite"
        >
            {/* Grid pattern background */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={`toast-grid-h-${i}`}
                        className="absolute w-full border-t border-black"
                        style={{ top: `${i * 25}%` }}
                    />
                ))}
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={`toast-grid-v-${i}`}
                        className="absolute h-full border-l border-black"
                        style={{ left: `${i * 25}%` }}
                    />
                ))}
            </div>

            {/* Top accent bar */}
            <div className={`absolute top-0 left-0 w-full h-1 ${getAccentColor()}`} />

            {/* Content */}
            <div className="relative z-10 flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold tracking-wider mb-1" data-testid="toast-title">
                        {toast.title}
                    </h4>
                    {toast.message.includes("https") ? (
                        <Link className="text-xs text-gray-700 leading-relaxed wrap-break-word" data-testid="toast-message" href={toast.message} target="_blank">
                            {toast.message}
                        </Link>
                    ) : (
                        <p className="text-xs text-gray-700 leading-relaxed wrap-break-word" data-testid="toast-message">{toast.message}</p>
                    )}
                </div>

                {!toast.persistent && (
                    <button
                        onClick={handleClose}
                        className="flex-shrink-0 p-1 hover:bg-gray-100 transition-colors border border-black hover:border-red-600"
                        data-testid="toast-close"
                        aria-label="Close notification"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            {/* Progress bar for timed toasts */}
            {toast.duration && !toast.persistent && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-200">
                    <div
                        className={`h-full ${getAccentColor()} transition-all ease-linear`}
                        style={{
                            animation: `shrink ${toast.duration}ms linear forwards`,
                        }}
                    />
                </div>
            )}
        </div>
    )
}

// Toast Container Component
export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
    return (
        <div
            className="fixed bottom-2 right-4 z-50 space-y-2"
            data-testid="toast-container"
            style={{ maxWidth: "calc(100vw - 2rem)" }}
        >
            {toasts.map((toast) => (
                <ToastComponent key={toast.id} toast={toast} onClose={onClose} />
            ))}
        </div>
    )
}

// Toast Hook for managing toasts
export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = (toast: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newToast: Toast = {
            id,
            duration: 5000, // Default 5 seconds
            ...toast,
        }
        setToasts((prev) => [...prev, newToast])
        return id
    }

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }

    const updateToast = (id: string, updates: Partial<Toast>) => {
        setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, ...updates } : toast)))
    }

    const clearAllToasts = () => {
        setToasts([])
    }

    // Test helpers
    const showSuccessToast = (title: string, message: string, options?: Partial<Toast>) => {
        return addToast({ type: "success", title, message, ...options })
    }

    const showErrorToast = (title: string, message: string, options?: Partial<Toast>) => {
        return addToast({ type: "error", title, message, ...options })
    }

    const showLoadingToast = (title: string, message: string, options?: Partial<Toast>) => {
        return addToast({ type: "loading", title, message, persistent: true, ...options })
    }

    const showInfoToast = (title: string, message: string, options?: Partial<Toast>) => {
        return addToast({ type: "info", title, message, ...options })
    }

    return {
        toasts,
        addToast,
        removeToast,
        updateToast,
        clearAllToasts,
        // Test helpers
        showSuccessToast,
        showErrorToast,
        showLoadingToast,
        showInfoToast,
    }
}

// CSS for progress bar animation (add to globals.css)
const toastStyles = `
@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
`

// Export styles to be added to globals.css
export { toastStyles }