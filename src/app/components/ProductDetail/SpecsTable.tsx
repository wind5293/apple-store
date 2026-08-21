type Spec = {
    name: string;
    value: string;
}

export default function SpecsTable({ specs }: { specs: Spec[] } ) {
    return (
        <div className="mt-8">
            <h2 className="text-sm font-bold text-slate-800 mb-3">Thông số kĩ thuật</h2>
            <dl className="w-full text-sm ">
                {specs.map((spec, i) => (
                    <div key={i} className="border-b last:border-b-0 border-slate-100 flex flex-row">
                        <dt className="py-2 text-slate-500 w-1/3">{spec.name}</dt>
                        <dd className="flex-1 py-2 text-slate-800 font-medium">{spec.value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}