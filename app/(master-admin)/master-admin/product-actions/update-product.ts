"use server";
import { Product } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";
import { uploadBrochure } from "./upload-brochure";

export async function updateProductImage(productId: string, file: File) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("products")
    .update(productId, file, {
      cacheControl: "3600",
      upsert: true,
    });
  if (error) {
    return error;
  }
  return data;
}

export async function updateProduct(
  productId: string,
  product: Partial<{
    name: string;
    description: string;
    imageSrc: string | File;
    link: string;
    inStock: boolean;
    tags?: number[];
    modifiers?: number[];
    isSubscription?: boolean;
    default_price: number;
    subscriptionInterval?: string;
    subscriptionPrice?: number;
    brochure?: File;
    brochureUrl?: string;
    weight?: number;
  }>
) {
  const supabase = await createClient();

  let imageUrl = product.imageSrc as string;
  if (product.imageSrc instanceof File) {
    await updateProductImage(productId, product.imageSrc);
    const { data } = supabase.storage.from("products").getPublicUrl(productId);
    imageUrl = data.publicUrl;
  }

  let brochureUrl = product.brochureUrl;
  if (product.brochure instanceof File) {
    const brochureResult = await uploadBrochure(productId, product.brochure);
    if (brochureResult instanceof Error) {
      console.error("Error uploading brochure:", brochureResult);
    } else {
      brochureUrl = brochureResult;
    }
  }

  const { modifiers, tags, isSubscription, subscriptionInterval, subscriptionPrice, ...productData } = product;

  const { data, error } = await supabase
    .from("products")
    .update({
      ...productData,
      imageSrc: imageUrl,
      brochureUrl: brochureUrl,
      subscription: product.isSubscription || false,
      subscription_interval: product.subscriptionInterval || null,
      subscription_price: product.subscriptionPrice || null,
    })
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    return new Error(error.message);
  }

  // Handle tags update
  if (tags) {
    console.log("tags", tags);
    console.log("productId", productId);
    const { error: tagError } = await supabase.from("product_tags").delete().eq("product_id", productId);
    if (tagError) {
      return new Error(tagError.message);
    }

    else {
      if (tags.length > 0) {
        const productTags = tags.map((tagId) => ({
          product_id: productId,
          tag_id: tagId,
        }));

        console.log("productTags", productTags);

        const { error: tagError } = await supabase.from("product_tags").insert(productTags)
        if (tagError) {
          return new Error(tagError.message);
        }
      }
    }
  }

  // Handle modifier group update
  if (modifiers) {
    console.log("modifiers", modifiers);
    await supabase.from("products_modifiers").delete().eq("product_id", productId);
    if (modifiers.length > 0) {
      const modifierGroupData = modifiers.map((modifierGroupId) => ({
        product_id: productId,
        modifier_group_id: modifierGroupId,
      }));
      const { error: modifierGroupError } = await supabase.from("products_modifiers").insert(modifierGroupData);
      if (modifierGroupError) {
        return new Error(modifierGroupError.message);
      }
    }
  }

  // Handle modifiers update
  // if (modifiers !== undefined) {
  //   await supabase
  //     .from("product_modifiers")
  //     .delete()
  //     .eq("product_id", productId);
  //   if (modifiers.length > 0) {
  //     const modifierData = modifiers.map((modifier) => ({
  //       product_id: productId,
  //       ...modifier,
  //     }));
  //     const { error: modifierError } = await supabase
  //       .from("product_modifiers")
  //       .insert(modifierData);
  //     if (modifierError) {
  //       return new Error(modifierError.message);
  //     }
  //   }
  // }

  return data;
}
