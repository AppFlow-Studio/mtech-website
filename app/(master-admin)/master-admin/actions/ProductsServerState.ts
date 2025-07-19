import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts } from "./api/get-products";
import { removeProduct } from "./api/remove-product";
import { editProduct } from "./api/edit-product";

export const useProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: getProducts,
    })
}


export const useRemoveSelectedProducts = (onSuccess?:Function) =>{
    const queryClient = useQueryClient();

    const { mutate:remove } = useMutation({
        mutationFn:removeProduct,
        onSuccess: (productId) => {
            //Updating posts state
            queryClient.setQueryData(["products"],(prev:any[])=>{
                return prev.filter((x:any)=>x.id !== productId)
            })
            //Trigger side effects
            onSuccess?.()
        },
    });

    return {remove}
}

// export const useEditProduct = (onSuccess?:Function) =>{
//     const queryClient = useQueryClient();

//     const { mutate: edit } = useMutation({
//         mutationFn:editProduct,
//         onSuccess: (product) => {
//             queryClient.setQueryData(['products'], (old:any[]) => [...old, product]);
//             onSuccess?.()
//         },
//     });

//     return {edit}
// }