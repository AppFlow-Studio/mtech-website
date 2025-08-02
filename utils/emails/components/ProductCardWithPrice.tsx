import { Product } from "@/lib/types";
import { Section, Img, Text, Button } from "@react-email/components";

export const ProductCardWithPrice = ({ product, notes, quantity, price }: { product: Product, notes: string | undefined, quantity: number, price: number }) => (
    <Section className="my-[16px]">
        <table className="w-full">
            <tbody className="w-full">
                <tr className="w-full">
                    <td className="box-border w-1/2 pr-[32px]">
                        <Img
                            alt={product?.name}
                            className="w-full rounded-[8px] object-cover"
                            height={220}
                            src={product?.imageSrc && product.imageSrc[0] == '/' ? `https://mtechdistributor.com${product.imageSrc}` : product.imageSrc}
                        />
                    </td>
                    <td className="w-1/2 align-baseline">
                        <Text className="m-0 mt-[8px] font-semibold text-[20px] text-gray-900 leading-[28px]">
                            {product?.name}
                        </Text>
                        <Text className="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
                            {product?.description.split('.')[0]}...
                        </Text>
                        <Text className="mt-[8px] font-semibold text-[18px] text-gray-900 leading-[28px]">
                            Quantity: <strong>{quantity}</strong>
                        </Text>
                        <Text className="mt-[8px] font-semibold text-[18px] text-gray-900 leading-[28px]">
                            Notes: <strong>{notes || 'No notes'}</strong>
                        </Text>
                        <Text className="mt-[8px] font-semibold text-[18px] text-gray-900 leading-[28px]">
                            Quoted Price: <strong className="text-green-500">${price}</strong>
                        </Text>
                    </td>
                </tr>
            </tbody>
        </table>
    </Section>
)