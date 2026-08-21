import { Star } from "lucide-react";

export default function ProductHeader({ name, rating, totalReviews }: {
    name: string;
    rating: number;
    totalReviews: number;
}) {
    return (
        <div className="flex flex-col gap-3 ">
            <h1 className="text-2xl font-semibold ">{name}</h1>
            <div className="flex flex-row gap-2">
                <Star className="fill-yellow-400" strokeWidth={0} />
                <p className="">{rating}</p>
                <p className="text-[#71717A]">{`(${totalReviews} đánh giá)`}</p>
            </div>
            <div className="text-[#3B82F6]">

            </div>
        </div>
    );
}