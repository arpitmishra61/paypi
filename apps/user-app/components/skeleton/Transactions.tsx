import { Skeleton } from "@/components/ui/skeleton"

export function TransactionSkeleton({ count }: { count: number }) {
    return (
        <div className="w-[400px] space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between h-[36px]"
                >
                    {/* Left: icon + text */}
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-12 rounded-full" />
                        <div className="space-y-1">
                            <Skeleton className="h-6 w-[220px]" />
                            <Skeleton className="h-6 w-[220px]" />
                        </div>
                    </div>

                    {/* Right: amount */}
                    <Skeleton className="h-4 w-[70px]" />
                </div>
            ))}
        </div>
    )
}
