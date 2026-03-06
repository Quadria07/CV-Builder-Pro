export function EditorSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="h-5 bg-slate-200 rounded w-1/3 mb-5" />
                    <div className="space-y-3">
                        <div className="h-9 bg-slate-100 rounded" />
                        <div className="h-9 bg-slate-100 rounded" />
                        <div className="h-24 bg-slate-100 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ATSSkeleton() {
    return (
        <div className="space-y-5 animate-pulse">
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-2">
                        <div className="h-6 bg-slate-200 rounded w-1/3" />
                        <div className="h-4 bg-slate-100 rounded w-1/2" />
                    </div>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-12 bg-slate-100 rounded-xl" />
                    ))}
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
                <div className="h-5 bg-slate-200 rounded w-1/4 mb-4" />
                <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-10 bg-slate-100 rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function PreviewSkeleton() {
    return (
        <div className="bg-white p-8 rounded-lg border border-gray-200 animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/2 mx-auto" />
            <div className="h-4 bg-slate-100 rounded w-1/3 mx-auto" />
            <div className="border-t border-slate-100 pt-4 space-y-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className={`h-3 bg-slate-100 rounded ${i % 3 === 0 ? 'w-3/4' : 'w-full'}`} />
                ))}
            </div>
        </div>
    );
}
