"use client";

import SelectField from "@/app/components/SelectField";
import { useEffect, useState } from "react";
import { getDistrictsByProvince, provinces } from "@/app/lib/location";
import { Ticket } from "lucide-react";
import { completeOrder, OrderWithId, ShippingInfo } from "@/app/lib/orders";
import { ProductWithId } from "@/app/types/products";
import { getProductsByIds } from "@/app/lib/products";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";

export default function PaymentInfoClient({ order }: { order: OrderWithId }) {
    const [emailContact, setEmailContact] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedCommune, setSelectedCommune] = useState("");
    const [shopAddress, setShopAddress] = useState("");
    const [recipientName, setRecipientName] = useState("");
    const [recipientNumber, setRecipientNumber] = useState("");
    const [recipientAddress, setRecipientAddress] = useState("");
    const [note, setNote] = useState("");
    const [pickUpInStoreFlag, setPickUpInStoreFlag] = useState(true);
    const [companyInvolce, setCompanyInvolce] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"" | "store" | "qr" | "vnpay" | "momo">("");

    const [products, setProducts] = useState<ProductWithId[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState("");

    const router = useRouter();

    const { deleteFromCart } = useCart();

    const totalItemQuantity = order.items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = order.items.reduce((total, item) => total + item.priceAtOrder * item.quantity, 0);

    function setButtonColor(condition: boolean) {
        if (condition) {
            return "bg-[#EFF5FF] border border-[#0064EC] text-[#0064EC] font-semibold";
        } else {
            return "bg-[#F7F7F8] border border-[#E4E4E7]";
        }
    }

    async function handleCompleteOrder() {
        if (pickUpInStoreFlag) {
            if (!selectedProvince || !selectedDistrict || !shopAddress) {
                setError("Vui lòng điền đầy đủ thông tin của cửa hàng");
                return;
            }
        } else {
            if (!selectedProvince || !selectedDistrict || !selectedCommune || !recipientName || !recipientNumber || !recipientAddress) {
                setError("Vui lòng điền đầy đủ thông tin nhận hàng");
                return;
            }
        } 

        if (!paymentMethod) {
            setError("Vui lòng chọn phương thức thanh toán");
            return;
        }
        
        const shippingInfo: ShippingInfo = pickUpInStoreFlag ? {
            type: "pickup",
            province: selectedProvince,
            district: selectedDistrict,
            shopAddress: shopAddress
        } : {
            type: "delivery",
            recipientName: recipientName,
            recipientNumber: recipientNumber,
            province: selectedProvince,
            district: selectedDistrict,
            commune: selectedCommune,
            recipientAddress: recipientAddress
        }

        const completionData = {
            shippingInfo: shippingInfo,
            email: emailContact,
            note: note,
            paymentMethod: paymentMethod
        }

        try {
            setIsLoading(true);

            const productIds = order.items.map(item => item.productId);
            await completeOrder(completionData, order.id, order.uid, productIds);

            await Promise.all(productIds.map(id => deleteFromCart(id)));

            router.push("/");
        } catch(error) {
            console.log(error);
            setError("Không thể hoàn tất đơn hàng, vui lòng thử lại");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        async function getProducts() {
            const productId = order.items.map(item => item.productId);
            setProducts(await getProductsByIds(productId))
            setIsLoadingProducts(false);
        }
        getProducts();
    }, []);

    return (
        <div className="bg-[#F5F5F5] min-h-screen">
            <div className="grid grid-cols-3 gap-4 w-7xl ml-auto mr-auto p-3 text-black text-sm">
                <div className="grid col-span-2 gap-4 py-3 content-start">
                    <div className="bg-[#FFFFFF] rounded-md px-4 py-3 flex flex-col gap-2">
                        <h3 className="font-semibold">Danh sách sản phẩm</h3>
                        {isLoadingProducts ? (
                            <p className="flex flex-col justify-center items-center max-h-full max-w-full">Đang tải</p>
                        ) : (
                            order.items.map(item => {
                                const product = products.find(p => p.id === item.productId);
                                if (!product) return null;
                                return (
                                    <div key={item.productId} className="flex flex-row justify-between items-center">
                                        <div className="flex flex-row gap-2 items-center">
                                            <Image
                                                width={50}
                                                height={50}
                                                src={product.thumbnailUrl}
                                                alt={product.slug}
                                            />
                                            <p className="font-bold">{product.name}</p>
                                        </div>
                                        <div className="flex flex-row gap-6 items-center">
                                            <p>Số lượng: <span className="font-bold">{item.quantity}</span></p>
                                            <div className="flex flex-col items-end">
                                                <p className="text-[#D80726] font-bold">{item.priceAtOrder.toLocaleString("vi-VN") + "đ"}</p>
                                                <p className="text-xs text-gray-400 line-through">{product.originalPrice.toLocaleString("vi-VN") + "đ"}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div className="bg-[#FFFFFF] rounded-md px-4 py-3">
                        <h3 className="font-semibold">Thông tin khách hàng</h3>
                        <div className="flex flex-row justify-between mt-2">
                            <div className="flex flex-col gap-1 flex-2">
                                <p className="font-semibold">Nguyễn Đức Phong</p>
                                <p>0981696125</p>
                            </div>
                            <div className="flex flex-col gap-2 flex-3 border-l border-gray-300 px-5">
                                <p>Email</p>
                                <input
                                    type="email"
                                    value={emailContact}
                                    placeholder="email@example.com"
                                    onChange={(e) => setEmailContact(e.target.value)}
                                    className="border border-gray-300 rounded-md px-4 py-2"
                                />
                                <p className="text-xs text-gray-500">{"(*) Hoá đơn VAT sẽ được gửi thông qua email này"}</p>
                                {emailContact && (
                                    <div className="flex flex-row gap-2 items-center">
                                        <input type="checkbox" className="size-5 rounded-md" />
                                        <p>Nhận email thông báo và ưu đãi đến từ Apple Store</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col bg-[#FFFFFF] rounded-md px-4 py-3 gap-3">
                        <div className="flex flex-row justify-between">
                            <h3 className="font-semibold">Chọn hình thức nhận hàng</h3>
                            <div className="flex flex-row gap-3">
                                <button
                                    onClick={() => setPickUpInStoreFlag(true)}
                                    className={`${setButtonColor(pickUpInStoreFlag)} py-1 px-5 rounded-4xl`}
                                >
                                    Nhận tại cửa hàng
                                </button>
                                <button
                                    onClick={() => setPickUpInStoreFlag(false)}
                                    className={`${setButtonColor(!pickUpInStoreFlag)} py-1 px-5 rounded-4xl`}
                                >
                                    Giao hàng tận nơi
                                </button>
                            </div>
                        </div>
                        {pickUpInStoreFlag ? (
                            <form className="grid grid-cols-2 gap-3 px-1">
                                <SelectField
                                    label="Tỉnh/Thành phố"
                                    value={selectedProvince}
                                    onChange={(value) => {
                                        setSelectedProvince(value);
                                        setSelectedDistrict("");
                                    }}
                                    options={provinces}
                                />
                                <SelectField
                                    label="Quận/Huyện"
                                    value={selectedDistrict}
                                    onChange={(value) => {
                                        setSelectedDistrict(value);
                                    }}
                                    options={getDistrictsByProvince(selectedProvince)}
                                />
                                <div className="flex flex-col gap-1 col-span-2">
                                    <label className="font-semibold">Cửa hàng</label>
                                    <input
                                        type="text"
                                        value={shopAddress}
                                        onChange={(e) => setShopAddress(e.target.value)}
                                        placeholder="Chọn địa chỉ cửa hàng"
                                        className="border border-gray-300 placeholder:text-gray-400 rounded-lg p-4 w-full focus:border-gray-400 focus:outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-1 col-span-2">
                                    <label className="font-semibold">Ghi chú <span className="text-gray-400">{`(nếu có)`}</span></label>
                                    <input
                                        type="text"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Nhập ghi chú"
                                        className="border border-gray-300 placeholder:text-gray-400 rounded-lg p-4 w-full focus:border-gray-400 focus:outline-none"
                                    />
                                </div>
                            </form>
                        ) : (
                            <form className="grid grid-cols-2 gap-3 px-1">
                                <div className="flex flex-col gap-1 ">
                                    <label className="font-semibold">Tên người nhận</label>
                                    <input
                                        type="text"
                                        value={recipientName}
                                        onChange={(e) => setRecipientName(e.target.value)}
                                        placeholder="Nhập tên người nhận"
                                        className="border border-gray-300 placeholder:text-gray-400 rounded-lg p-4 w-full focus:border-gray-400 focus:outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-1 ">
                                    <label className="font-semibold">Số điện thoại người nhận</label>
                                    <input
                                        type="text"
                                        value={recipientNumber}
                                        onChange={(e) => setRecipientNumber(e.target.value)}
                                        placeholder="Nhập số điện thoại"
                                        className="border border-gray-300 placeholder:text-gray-400 rounded-lg p-4 w-full focus:border-gray-400 focus:outline-none"
                                    />
                                </div>
                                <p className="col-span-2">Địa chỉ nhận hàng</p>
                                <SelectField
                                    label="Tỉnh/Thành phố"
                                    value={selectedProvince}
                                    onChange={(value) => {
                                        setSelectedProvince(value);
                                        setSelectedDistrict("");
                                    }}
                                    options={provinces}
                                />
                                <SelectField
                                    label="Quận/Huyện"
                                    value={selectedDistrict}
                                    onChange={(value) => {
                                        setSelectedDistrict(value);
                                    }}
                                    options={getDistrictsByProvince(selectedProvince)}
                                />
                                <div className="flex flex-col gap-1 ">
                                    <label className="font-semibold">Phường/Xã</label>
                                    <input
                                        type="text"
                                        value={selectedCommune}
                                        onChange={(e) => setSelectedCommune(e.target.value)}
                                        placeholder="Chọn phường/xã"
                                        className="border border-gray-300 placeholder:text-gray-400 rounded-lg p-4 w-full focus:border-gray-400 focus:outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-1 ">
                                    <label className="font-semibold">Địa chỉ nhà</label>
                                    <input
                                        type="text"
                                        value={recipientAddress}
                                        onChange={(e) => setRecipientAddress(e.target.value)}
                                        placeholder="Nhập địa chỉ nhà"
                                        className="border border-gray-300 placeholder:text-gray-400 rounded-lg p-4 w-full focus:border-gray-400 focus:outline-none"
                                    />
                                </div>
                                <p className="col-span-2 p-2 bg-[#EFF5FF] border border-[#0064EC] text-xs rounded-md">
                                    Thời gian giao hàng trong dịp lễ có thể kéo dài hơn so với ngày thường. Quý khách vui lòng liên hệ tổng đài 18002097 nếu cần hỗ trợ.
                                </p>
                                <div className="col-span-2 flex flex-row gap-3 items-center">
                                    <input type="checkbox" className="size-4 rounded-md" />
                                    <p>Lưu địa chỉ cho lần mua kế tiếp</p>
                                </div>
                                <div className="flex flex-col gap-1 col-span-2">
                                    <label className="font-semibold">Ghi chú <span className="text-gray-400">{`(nếu có)`}</span></label>
                                    <input
                                        type="text"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Nhập ghi chú"
                                        className="border border-gray-300 placeholder:text-gray-400 rounded-lg p-4 w-full focus:border-gray-400 focus:outline-none"
                                    />
                                </div>
                            </form>
                        )}
                    </div>
                </div>
                <div className="grid col-span-1 gap-4 py-3 content-start">
                    <div className="bg-[#FFFFFF] rounded-md px-4 py-3 flex flex-col gap-2">
                        <h3 className="font-semibold">Thông tin đơn hàng</h3>
                        <div>
                            <div className="p-2 flex flex-row justify-between items-center">
                                <div className="flex flex-row gap-1 items-center">
                                    <Ticket className="" />
                                    <p>Áp dụng mã giảm giá</p>
                                </div>
                                <button
                                    className="bg-[#FBE6E8] text-[#D80726] px-2 py-1 rounded-2xl"
                                >
                                    Chọn
                                </button>
                            </div>
                            <div className="p-1 flex flex-row justify-between items-center">
                                <p>Số lượng sản phẩm</p>
                                <p className="font-semibold">{totalItemQuantity}</p>
                            </div>
                            <div className="p-1 flex flex-row justify-between items-center">
                                <p>Tổng tiền hàng</p>
                                <p className="font-bold">{totalPrice.toLocaleString("vi-VN") + "đ"}</p>
                            </div>
                        </div>
                        <div className="border-b border-gray-300"></div>
                        <div className="p-1 flex flex-row justify-between items-center">
                            <p>Giảm giá trực tiếp</p>
                            <p className="font-bold text-green-400">1</p>
                        </div>
                        <div className="border-b border-gray-300"></div>
                        <div>
                            <div className="p-1 flex flex-row justify-between items-center">
                                <div className="flex flex-col">
                                    <p className="uppercase font-semibold">Tổng tiền</p>
                                    <p className="text-xs text-gray-400">{"(Đã bao gồm VAT được làm tròn)"}</p>
                                </div>
                                <p className="font-bold text-[#D80726]">{totalPrice.toLocaleString() + "đ"}</p>
                            </div>
                            <div className="p-1 flex flex-row justify-between items-center">
                                <p>Bạn đã tiết kiệm được</p>
                                <p className="font-bold text-green-400">1</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#FFFFFF] rounded-md px-4 py-3 flex flex-col gap-2">
                        <h3 className="font-semibold">Chọn phương thức thanh toán</h3>
                        <label className="flex flex-row gap-2 items-center">
                            <Image
                                width={30}
                                height={30}
                                src="/COS.png"
                                alt="COS logo"
                            />
                            <div className="flex flex-col gap-1">
                                <p className="font-semibold">Thanh toán tại cửa hàng</p>
                                <p className="text-xs text-blue-500">Apple Store sẽ giữ sản phẩm và ưu đãi trong vòng 24 giờ kể từ thời điểm đặt hàng</p>
                            </div>
                            <input
                                name="paymentMethod"
                                type="radio"
                                value="store"
                                checked={paymentMethod === "store"}
                                onChange={() => setPaymentMethod("store")}
                                className="size-5 ml-auto shrink-0"
                            />
                        </label>
                        <div className="border-b border-gray-300"></div>
                        <label className="flex flex-row gap-2 items-center">
                            <Image
                                width={30}
                                height={30}
                                src="/QRCode.webp"
                                alt="QR code"
                            />
                            <p className="font-semibold">Chuyển khoản ngân hàng qua mã QR</p>
                            <input
                                name="paymentMethod"
                                type="radio"
                                value="qr"
                                checked={paymentMethod === "qr"}
                                onChange={() => setPaymentMethod("qr")}
                                className="size-5 ml-auto"
                            />
                        </label>
                        <div className="border-b border-gray-300"></div>
                        <label className="flex flex-row gap-2 items-center">
                            <Image
                                width={30}
                                height={30}
                                src="/vnpay.webp"
                                alt="vnpay logo"
                            />
                            <p className="font-semibold">VNPAY</p>
                            <input
                                name="paymentMethod"
                                type="radio"
                                value="vnpay"
                                checked={paymentMethod === "vnpay"}
                                onChange={() => setPaymentMethod("vnpay")}
                                className="size-5 ml-auto"
                            />
                        </label>
                        <div className="border-b border-gray-300"></div>
                        <label className="flex flex-row gap-2 items-center">
                            <Image
                                width={30}
                                height={30}
                                src="/momo_vi.webp"
                                alt="momo logo"
                            />
                            <p className="font-semibold">MoMo</p>
                            <input
                                name="paymentMethod"
                                type="radio"
                                value="momo"
                                checked={paymentMethod === "momo"}
                                onChange={() => setPaymentMethod("momo")}
                                className="size-5 ml-auto"
                            />
                        </label>
                        <button
                            disabled={isLoading}
                            onClick={() => handleCompleteOrder()}
                            className="mt-3 uppercase text-base text-white font-bold bg-[#FF102B] hover:bg-[#D70018] p-3 rounded-lg disabled:bg-gray-600"
                        >
                            Hoàn tất
                        </button>
                        {error && <p className="text-xs text-red-500">{error}</p>}
                    </div>
                    <div className="bg-[#FFFFFF] rounded-md px-4 py-3">
                        <p>Bằng việc đặt hàng, bạn đồng ý với Điều khoản sử dụng của Apple Store.</p>
                        <p>Với đơn hàng <span className="font-bold">từ 10 triệu trở lên</span>, Apple Store xin phép kiểm tra thẻ cứng và CCCD đúng của chủ thẻ trước khi tiến hành giao hàng nhằm hạn chế các trường hợp gian lận.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}