export function hasDiscount(product: { price: number; originalPrice?: number }): boolean {
    return !!product.originalPrice && product.originalPrice > product.price;
}