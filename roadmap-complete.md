# Roadmap hoàn thiện web bán hàng online

## 1. Kiến trúc dự án

### 1.1. Môi trường và stack

Dự án này là ứng dụng web bán hàng online xây dựng bằng:

- Next.js 16 App Router
- Firebase Web SDK cho client-side auth và Firestore
- Firebase Admin SDK cho session cookie, authentication server-side, và truy vấn admin
- React Context để quản lý auth và cart
- TypeScript
- Tailwind CSS / CSS module cho giao diện
- Lucide React và Image component của Next

### 1.2. Cấu trúc thư mục chính

```text
src/
  app/
    api/                  # API route cho auth session/logout
    cart/                 # Giỏ hàng và thanh toán
    components/           # UI components gồm product, auth, navbar
    context/              # AuthContext, CartContext
    lib/                  # Chức năng liên quan Firebase và business logic
    me/                   # Profile, address, password, orders
    products/             # Trang chi tiết sản phẩm
    types/                # Type model của product, category
```

### 1.3. Kiến trúc dữ liệu

Dữ liệu dự án chủ yếu lưu trong Firestore collections:

- `products`
- `categories`
- `carts/{uid}/items`
- `orders`
- `users`

Dữ liệu được truy vấn qua các layer:

1. `client` component giao tiếp với Firebase client SDK trong [src/app/lib/firebase.ts](src/app/lib/firebase.ts).
2. `server` component truy vấn dữ liệu qua service layer trong [src/app/lib/products.ts](src/app/lib/products.ts), [src/app/lib/category.ts](src/app/lib/category.ts), [src/app/lib/orders-admin.ts](src/app/lib/orders-admin.ts).
3. `server-side auth` dùng `getAuthenticatedUser` ở [src/app/lib/firebase-admin.ts](src/app/lib/firebase-admin.ts) để xác thực session cookie.
4. `adminDb` dùng Firebase Admin SDK để truy vấn dữ liệu user/order bất chấp môi trường client.

### 1.4. Kiến trúc luồng người dùng

#### Auth và session

- User đăng nhập hoặc đăng ký qua form.
- Sau khi xác thực, client gọi API `/api/auth/session` để tạo session cookie.
- Session cookie được xác thực trên route server bằng `getAuthenticatedUser`.
- Logout gọi `POST /api/auth/logout` rồi `signOut(auth)`.

#### Product detail flow

- Trang danh mục / trang chủ lấy `products` và `categories` từ Firebase.
- Product card hiển thị khối sản phẩm.
- Product detail page dùng `getProductBySlug` và `getProductsByGroupId` để show variants.

#### Cart flow

- `CartProvider` giữ state giỏ hàng ở client.
- `setCartItem`, `getCartItems`, `deleteCartItem` trên Firestore đồng bộ cart.
- Cart page chọn item, chỉnh số lượng, xóa item, tính tổng tiền, chuyển sang checkout.

#### Checkout flow

- Cart page gọi `createOrder(user.uid, items, products, selectedIds)` tạo order draft.
- `PaymentInfoClient` kéo order theo ID, hiển thị sản phẩm và form điền thông tin thanh toán.
- Người dùng chọn hình thức nhận hàng và thanh toán.
- `completeOrder` cập nhật order từ `draft` sang `completed`, xóa item khỏi cart.

#### Profile / user dashboard

- `MeLayout` truy vấn profile và order list cho uid.
- `ProfileClient` mở popup để cập nhật profile, địa chỉ, password.
- `AddressUpdateForm` thêm địa chỉ mặc định vào profile.

## 2. Tổng quan dự án hiện tại

Dự án này là một web bán hàng online theo mô hình Next.js + Firebase, hướng tới mô hình cửa hàng Apple Store với:

- Trang chủ hiển thị sản phẩm nổi bật và sản phẩm theo danh mục.
- Trang chi tiết sản phẩm với thông tin, ảnh, mô tả, cấu hình và biến thể.
- Giỏ hàng với tăng/giảm/sửa/xoá sản phẩm.
- Tạo đơn hàng nháp và tiến hành thanh toán.
- Xác thực người dùng qua email/password hoặc Google.
- Trang profile người dùng, cập nhật họ tên, giới tính, ngày sinh, số điện thoại, email, địa chỉ mặc định và đổi mật khẩu.
- Trang lịch sử / quản lý đơn hàng dành cho người dùng.

Các file nền tảng chính:

- Layout và navigation: [src/app/layout.tsx](src/app/layout.tsx), [src/app/components/Navbar.tsx](src/app/components/Navbar.tsx)
- Trang chủ: [src/app/page.tsx](src/app/page.tsx)
- Sản phẩm: [src/app/products/[slug]/page.tsx](src/app/products/[slug]/page.tsx)
- Giỏ hàng: [src/app/cart/page.tsx](src/app/cart/page.tsx)
- Thanh toán: [src/app/cart/payment-info/[orderId]/PaymentInfoClient.tsx](src/app/cart/payment-info/[orderId]/PaymentInfoClient.tsx)
- Tài khoản / hồ sơ: [src/app/me/profile/ProfileClient.tsx](src/app/me/profile/ProfileClient.tsx)
- API xác thực: [src/app/api/auth/session/route.ts](src/app/api/auth/session/route.ts), [src/app/api/auth/logout/route.ts](src/app/api/auth/logout/route.ts)

## 3. Những phần đã có sẵn

### 3.1. Sản phẩm

- Hàm lấy sản phẩm nổi bật, lọc theo danh mục và query sản phẩm: [src/app/lib/products.ts](src/app/lib/products.ts)
- Component hiển thị thẻ sản phẩm: [src/app/components/ProductCard.tsx](src/app/components/ProductCard.tsx)
- Component hiển thị thông tin sản phẩm chi tiết: [src/app/components/ProductDetail/ProductInfo.tsx](src/app/components/ProductDetail/ProductInfo.tsx)

### 3.2. Giỏ hàng

- Tạo giỏ hàng đồng bộ với người dùng bằng Firestore: [src/app/context/CartContext.tsx](src/app/context/CartContext.tsx)
- Lưu/xoá/cập nhật sản phẩm trong cart: [src/app/lib/cart.ts](src/app/lib/cart.ts)

### 3.3. Đặt hàng

- Tạo đơn nháp từ giỏ hàng: [src/app/lib/orders.ts](src/app/lib/orders.ts)
- Hoàn tất đơn hàng với thông tin ship, email, ghi chú và phương thức thanh toán: [src/app/lib/orders.ts](src/app/lib/orders.ts)
- Tạo đơn hàng và hoàn tất bằng client: [src/app/cart/payment-info/[orderId]/PaymentInfoClient.tsx](src/app/cart/payment-info/[orderId]/PaymentInfoClient.tsx)

### 3.4. Auth và user profile

- Đăng ký, đăng nhập, Google Sign-In, đổi mật khẩu: [src/app/lib/auth.ts](src/app/lib/auth.ts)
- Tạo profile người dùng khi đăng ký: [src/app/components/Auth/RegisterForm.tsx](src/app/components/Auth/RegisterForm.tsx)
- Update profile, địa chỉ, tài khoản: [src/app/lib/users.ts](src/app/lib/users.ts), [src/app/me/ProfileUpdateForm.tsx](src/app/me/ProfileUpdateForm.tsx), [src/app/me/AddressUpdateForm.tsx](src/app/me/AddressUpdateForm.tsx)

## 4. Những phần còn thiếu / cần hoàn thiện

### 4.1. Trang lịch sử đơn hàng người dùng

File hiện có:

- [src/app/me/orders/page.tsx](src/app/me/orders/page.tsx)
- [src/app/me/orders/OrderPageClient.tsx](src/app/me/orders/OrderPageClient.tsx)

Hiện trang này đang rỗng. Chưa có:

- Danh sách đơn hàng của user
- Mã đơn, ngày đặt, trạng thái, tổng tiền
- Nút xem chi tiết đơn
- Link đến trang thanh toán / hoàn tất

Nội dung cần làm:

1. Lấy danh sách order của user từ Firestore bằng `getUserOrders` trong [src/app/lib/orders-admin.ts](src/app/lib/orders-admin.ts).
2. Hiển thị order list trong client component.
3. Có trạng thái đơn: draft, completed, pending, shipped, cancelled.
4. Thêm chi tiết từng đơn hàng, số lượng, sản phẩm, hình thức nhận hàng, phương thức thanh toán.

### 4.2. Form đổi mật khẩu

File hiện có:

- [src/app/me/profile/ProfileClient.tsx](src/app/me/profile/ProfileClient.tsx)

Trong popup `password`, component đang là placeholder:

```tsx
case 'password':
  return <div>Password form goes here</div>;
```

Cần làm:

1. Tạo form đổi mật khẩu thực sự.
2. Gắn logic `changeUserPassword` từ [src/app/lib/auth.ts](src/app/lib/auth.ts).
3. Kiểm tra mật khẩu cũ, mật khẩu mới, xác nhận mật khẩu lại.
4. Báo lỗi rõ ràng khi nhập sai.

### 4.3. Cập nhật profile và dữ liệu thực tế khi checkout

Trang thanh toán hiện đang hiển thị:

- Email người nhận nhập tay
- Tên người nhận và số điện thoại được nhập bằng tay trong form
- Tên khách hàng, số điện thoại trên UI đang là dữ liệu cố định /  hard-code: `Nguyễn Đức Phong`, `0981696125`

Cần làm:

1. Lấy thông tin profile người dùng từ `uid` để điền tên và điện thoại.
2. Kiểm tra profile có đầy đủ dữ liệu chưa.
3. Nếu thiếu dữ liệu, cho user cập nhật trước khi thanh toán.
4. Cho phép lưu địa chỉ giao hàng mặc định.

### 4.4. Search / category / filter

Navbar có input search nhưng chưa gắn logic. Cần thêm:

- Tìm kiếm sản phẩm theo tên.
- Lọc theo danh mục.
- Lọc theo giá.
- Lọc theo bộ nhớ, màu sắc, RAM.

### 4.5. Luồng checkout và trạng thái đơn hàng

Đơn hàng hiện chỉ tạo ở `draft` trong [src/app/lib/orders.ts](src/app/lib/orders.ts), sau đó chuyển thành `completed` trong `completeOrder`. Cần mở rộng:

- `draft` → `pending` → `confirmed` → `shipped` → `completed` hoặc `cancelled`
- Lưu trạng thái, thời gian cập nhật
- Xử lý tình huống cập nhật tồn kho
- Xử lý giảm giá và phí vận chuyển

### 4.6. Quản trị đơn giản

Dự án chưa có module admin để:

- Thêm sửa xoá sản phẩm
- Quản lý danh mục
- Quản lý đơn hàng
- Cập nhật trạng thái đơn hàng
- Cập nhật lượng tồn kho

Đây là phần cần bổ sung nếu muốn làm web bán hàng online hoàn chỉnh.

## 5. Thiếu / cần hoàn thiện rõ ràng

Các phần chưa hoàn thiện rõ ràng nhất:

1. `OrderPageClient` đang rỗng.
2. `ProfileClient` có `password` popup chưa triển khai.
3. Trang `me/orders/page.tsx` đang trống.
4. `CartContext` đang có tính chất “sync cart” chưa an toàn và chưa tối ưu.
5. `PaymentInfoClient` đang dùng dữ liệu người dùng / email / tên / số điện thoại hard-coded trong UI.
6. `AddressUpdateForm` chỉ lưu 1 địa chỉ mặc định vào profile, chưa hỗ trợ nhiều địa chỉ.
7. `Search` chưa hoạt động thực tế.
8. Không có admin CRUD / order management.

## 6. Thứ tự ưu tiên cần làm tiếp

### Ưu tiên 1: Hoàn thiện luồng checkout

1. Tạo draft order từ giỏ hàng.
2. Điền thông tin khách hàng / địa chỉ / thanh toán.
3. Hoàn tất order => lưu `completed` và xóa các item trong cart.
4. Hiển thị đơn hàng trong profile của user.

### Ưu tiên 2: Hoàn thiện user dashboard

1. Lấy thông tin user profile.
2. Cập nhật profile.
3. Chỉnh sửa/hiển thị địa chỉ mặc định.
4. Đổi mật khẩu.
5. Tạo màn hình order history.

### Ưu tiên 3: Hoàn thiện product discovery

1. Gắn search box.
2. Tạo API filter cho category + price + product spec.
3. Thêm phân trang.
4. Sắp xếp sản phẩm.

### Ưu tiên 4: Quản trị

1. Admin dashboard.
2. CRUD sản phẩm/danh mục.
3. Quản lý đơn hàng.
4. Quản lý trạng thái đơn.

## 7. Kế hoạch thực hiện chi tiết

### Bước 1: Hoàn thiện order history

- Tạo component `OrderPageClient` để render danh sách orders của user.
- Tạo UI: card order gồm mã đơn, ngày tạo, tổng, trạng thái, phương thức thanh toán.
- Thêm route `/me/orders` page để render `OrderPageClient`.

### Bước 2: Hoàn thiện mật khẩu

- Tạo `PasswordUpdateForm` trong folder `src/app/me`.
- Xử lý `changeUserPassword`.
- Validate form trước khi gửi.

### Bước 3: Dùng profile thật trong checkout

- Trong `PaymentInfoClient`, thay thế phần khách hàng hard-coded bằng dữ liệu user profile.
- Tích hợp `emailContact`, `recipientName`, `recipientNumber` từ `useAuth()` / `getUserProfile`.
- Cho phép lưu địa chỉ người dùng mặc định hoặc địa chỉ mới.

### Bước 4: Tìm kiếm và lọc

- Gắn input search ở `Navbar` vào query string.
- Thêm query `search` và `category` và `priceRange` qua Firestore query.
- Tạo page kết quả tìm kiếm hoặc filter component.

### Bước 5: Admin CRUD

- Tạo route `/admin/products`, `/admin/orders`, `/admin/categories`.
- Quản lý `products`, `categories`, `orders` trong Firestore.
- Thêm trạng thái giao hàng và thanh toán cho `orders`.

## 8. Kết luận

Đây là một dự án bán hàng online mẫu có đầy đủ cơ sở UI, flow đặt hàng, xác thực người dùng, giỏ hàng và hồ sơ người dùng. Tuy nhiên, để web trở nên hoàn chỉnh như một ứng dụng thương mại thực tế, bạn cần làm tiếp thêm 5 nhóm lớn:

- Order history / order detail
- Password update
- Checkout profile integration
- Product search/filter
- Admin management CRUD

Bản thân dự án đã thể hiện đúng hướng kiến trúc Next.js + Firebase và nên tiếp tục theo hướng này để rút ngắn thời gian hoàn thiện.

Dự án này là một web bán hàng online theo mô hình Next.js + Firebase, hướng tới mô hình cửa hàng Apple Store với:

- Trang chủ hiển thị sản phẩm nổi bật và sản phẩm theo danh mục.
- Trang chi tiết sản phẩm với thông tin, ảnh, mô tả, cấu hình và biến thể.
- Giỏ hàng với tăng/giảm/sửa/xoá sản phẩm.
- Tạo đơn hàng nháp và tiến hành thanh toán.
- Xác thực người dùng qua email/password hoặc Google.
- Trang profile người dùng, cập nhật họ tên, giới tính, ngày sinh, số điện thoại, email, địa chỉ mặc định và đổi mật khẩu.
- Trang lịch sử / quản lý đơn hàng dành cho người dùng.

Các file nền tảng chính:

- Layout và navigation: [src/app/layout.tsx](src/app/layout.tsx), [src/app/components/Navbar.tsx](src/app/components/Navbar.tsx)
- Trang chủ: [src/app/page.tsx](src/app/page.tsx)
- Sản phẩm: [src/app/products/[slug]/page.tsx](src/app/products/[slug]/page.tsx)
- Giỏ hàng: [src/app/cart/page.tsx](src/app/cart/page.tsx)
- Thanh toán: [src/app/cart/payment-info/[orderId]/PaymentInfoClient.tsx](src/app/cart/payment-info/[orderId]/PaymentInfoClient.tsx)
- Tài khoản / hồ sơ: [src/app/me/profile/ProfileClient.tsx](src/app/me/profile/ProfileClient.tsx)
- API xác thực: [src/app/api/auth/session/route.ts](src/app/api/auth/session/route.ts), [src/app/api/auth/logout/route.ts](src/app/api/auth/logout/route.ts)

## 2. Những phần đã có sẵn

### 2.1. Sản phẩm

- Hàm lấy sản phẩm nổi bật, lọc theo danh mục và query sản phẩm: [src/app/lib/products.ts](src/app/lib/products.ts)
- Component hiển thị thẻ sản phẩm: [src/app/components/ProductCard.tsx](src/app/components/ProductCard.tsx)
- Component hiển thị thông tin sản phẩm chi tiết: [src/app/components/ProductDetail/ProductInfo.tsx](src/app/components/ProductDetail/ProductInfo.tsx)

### 2.2. Giỏ hàng

- Tạo giỏ hàng đồng bộ với người dùng bằng Firestore: [src/app/context/CartContext.tsx](src/app/context/CartContext.tsx)
- Lưu/xoá/cập nhật sản phẩm trong cart: [src/app/lib/cart.ts](src/app/lib/cart.ts)

### 2.3. Đặt hàng

- Tạo đơn nháp từ giỏ hàng: [src/app/lib/orders.ts](src/app/lib/orders.ts)
- Hoàn tất đơn hàng với thông tin ship, email, ghi chú và phương thức thanh toán: [src/app/lib/orders.ts](src/app/lib/orders.ts)
- Tạo đơn hàng và hoàn tất bằng client: [src/app/cart/payment-info/[orderId]/PaymentInfoClient.tsx](src/app/cart/payment-info/[orderId]/PaymentInfoClient.tsx)

### 2.4. Auth và user profile

- Đăng ký, đăng nhập, Google Sign-In, đổi mật khẩu: [src/app/lib/auth.ts](src/app/lib/auth.ts)
- Tạo profile người dùng khi đăng ký: [src/app/components/Auth/RegisterForm.tsx](src/app/components/Auth/RegisterForm.tsx)
- Update profile, địa chỉ, tài khoản: [src/app/lib/users.ts](src/app/lib/users.ts), [src/app/me/ProfileUpdateForm.tsx](src/app/me/ProfileUpdateForm.tsx), [src/app/me/AddressUpdateForm.tsx](src/app/me/AddressUpdateForm.tsx)

## 3. Những phần còn thiếu / cần hoàn thiện

### 3.1. Trang lịch sử đơn hàng người dùng

File hiện có:

- [src/app/me/orders/page.tsx](src/app/me/orders/page.tsx)
- [src/app/me/orders/OrderPageClient.tsx](src/app/me/orders/OrderPageClient.tsx)

Hiện trang này đang rỗng. Chưa có:

- Danh sách đơn hàng của user
- Mã đơn, ngày đặt, trạng thái, tổng tiền
- Nút xem chi tiết đơn
- Link đến trang thanh toán / hoàn tất

Nội dung cần làm:

1. Lấy danh sách order của user từ Firestore bằng `getUserOrders` trong [src/app/lib/orders-admin.ts](src/app/lib/orders-admin.ts).
2. Hiển thị order list trong client component.
3. Có trạng thái đơn: draft, completed, pending, shipped, cancelled.
4. Thêm chi tiết từng đơn hàng, số lượng, sản phẩm, hình thức nhận hàng, phương thức thanh toán.

### 3.2. Form đổi mật khẩu

File hiện có:

- [src/app/me/profile/ProfileClient.tsx](src/app/me/profile/ProfileClient.tsx)

Trong popup `password`, component đang là placeholder:

```tsx
case 'password':
  return <div>Password form goes here</div>;
```

Cần làm:

1. Tạo form đổi mật khẩu thực sự.
2. Gắn logic `changeUserPassword` từ [src/app/lib/auth.ts](src/app/lib/auth.ts).
3. Kiểm tra mật khẩu cũ, mật khẩu mới, xác nhận mật khẩu lại.
4. Báo lỗi rõ ràng khi nhập sai.

### 3.3. Cập nhật profile và dữ liệu thực tế khi checkout

Trang thanh toán hiện đang hiển thị:

- Email người nhận nhập tay
- Tên người nhận và số điện thoại được nhập bằng tay trong form
- Tên khách hàng, số điện thoại trên UI đang là dữ liệu cố định /  hard-code: `Nguyễn Đức Phong`, `0981696125`

Cần làm:

1. Lấy thông tin profile người dùng từ `uid` để điền tên và điện thoại.
2. Kiểm tra profile có đầy đủ dữ liệu chưa.
3. Nếu thiếu dữ liệu, cho user cập nhật trước khi thanh toán.
4. Cho phép lưu địa chỉ giao hàng mặc định.

### 3.4. Search / category / filter

Navbar có input search nhưng chưa gắn logic. Cần thêm:

- Tìm kiếm sản phẩm theo tên.
- Lọc theo danh mục.
- Lọc theo giá.
- Lọc theo bộ nhớ, màu sắc, RAM.

### 3.5. Luồng checkout và trạng thái đơn hàng

Đơn hàng hiện chỉ tạo ở `draft` trong [src/app/lib/orders.ts](src/app/lib/orders.ts), sau đó chuyển thành `completed` trong `completeOrder`. Cần mở rộng:

- `draft` → `pending` → `confirmed` → `shipped` → `completed` hoặc `cancelled`
- Lưu trạng thái, thời gian cập nhật
- Xử lý tình huống cập nhật tồn kho
- Xử lý giảm giá và phí vận chuyển

### 3.6. Quản trị đơn giản

Dự án chưa có module admin để:

- Thêm sửa xoá sản phẩm
- Quản lý danh mục
- Quản lý đơn hàng
- Cập nhật trạng thái đơn hàng
- Cập nhật lượng tồn kho

Đây là phần cần bổ sung nếu muốn làm web bán hàng online hoàn chỉnh.

## 4. Thiếu / cần hoàn thiện rõ ràng

Các phần chưa hoàn thiện rõ ràng nhất:

1. `OrderPageClient` đang rỗng.
2. `ProfileClient` có `password` popup chưa triển khai.
3. Trang `me/orders/page.tsx` đang trống.
4. `CartContext` đang có tính chất “sync cart” chưa an toàn và chưa tối ưu.
5. `PaymentInfoClient` đang dùng dữ liệu người dùng / email / tên / số điện thoại hard-coded trong UI.
6. `AddressUpdateForm` chỉ lưu 1 địa chỉ mặc định vào profile, chưa hỗ trợ nhiều địa chỉ.
7. `Search` chưa hoạt động thực tế.
8. Không có admin CRUD / order management.

## 5. Thứ tự ưu tiên cần làm tiếp

### Ưu tiên 1: Hoàn thiện luồng checkout

1. Tạo draft order từ giỏ hàng.
2. Điền thông tin khách hàng / địa chỉ / thanh toán.
3. Hoàn tất order => lưu `completed` và xóa các item trong cart.
4. Hiển thị đơn hàng trong profile của user.

### Ưu tiên 2: Hoàn thiện user dashboard

1. Lấy thông tin user profile.
2. Cập nhật profile.
3. Chỉnh sửa/hiển thị địa chỉ mặc định.
4. Đổi mật khẩu.
5. Tạo màn hình order history.

### Ưu tiên 3: Hoàn thiện product discovery

1. Gắn search box.
2. Tạo API filter cho category + price + product spec.
3. Thêm phân trang.
4. Sắp xếp sản phẩm.

### Ưu tiên 4: Quản trị

1. Admin dashboard.
2. CRUD sản phẩm/danh mục.
3. Quản lý đơn hàng.
4. Quản lý trạng thái đơn.

## 6. Kế hoạch thực hiện chi tiết

### Bước 1: Hoàn thiện order history

- Tạo component `OrderPageClient` để render danh sách orders của user.
- Tạo UI: card order gồm mã đơn, ngày tạo, tổng, trạng thái, phương thức thanh toán.
- Thêm route `/me/orders` page để render `OrderPageClient`.

### Bước 2: Hoàn thiện mật khẩu

- Tạo `PasswordUpdateForm` trong folder `src/app/me`.
- Xử lý `changeUserPassword`.
- Validate form trước khi gửi.

### Bước 3: Dùng profile thật trong checkout

- Trong `PaymentInfoClient`, thay thế phần khách hàng hard-coded bằng dữ liệu user profile.
- Tích hợp `emailContact`, `recipientName`, `recipientNumber` từ `useAuth()` / `getUserProfile`.
- Cho phép lưu địa chỉ người dùng mặc định hoặc địa chỉ mới.

### Bước 4: Tìm kiếm và lọc

- Gắn input search ở `Navbar` vào query string.
- Thêm query `search` và `category` và `priceRange` qua Firestore query.
- Tạo page kết quả tìm kiếm hoặc filter component.

### Bước 5: Admin CRUD

- Tạo route `/admin/products`, `/admin/orders`, `/admin/categories`.
- Quản lý `products`, `categories`, `orders` trong Firestore.
- Thêm trạng thái giao hàng và thanh toán cho `orders`.

## 7. Kết luận

Đây là một dự án bán hàng online mẫu có đầy đủ cơ sở UI, flow đặt hàng, xác thực người dùng, giỏ hàng và hồ sơ người dùng. Tuy nhiên, để web trở nên hoàn chỉnh như một ứng dụng thương mại thực tế, bạn cần làm tiếp thêm 5 nhóm lớn:

- Order history / order detail
- Password update
- Checkout profile integration
- Product search/filter
- Admin management CRUD

Bản thân dự án đã thể hiện đúng hướng kiến trúc Next.js + Firebase và nên tiếp tục theo hướng này để rút ngắn thời gian hoàn thiện.
