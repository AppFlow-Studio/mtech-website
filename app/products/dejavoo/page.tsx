import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import Image from "next/image";

const dejavooProducts: Product[] = [
  {
    name: "Dejavoo P1 Desktop Android Terminal",
    description:
      "The Dejavoo P1 brings the power and flexibility of the Android OS to a sleek desktop payment terminal. It features a large 5-inch HD touchscreen that provides a user-friendly, app-like experience for both merchants and customers. With its powerful processor, the P1 ensures transactions are fast and secure, keeping your business moving forward without delay. This modern terminal supports a wide range of payment options and business management applications, making it a smart and forward-thinking choice for any retail or service environment.",
    imageSrc: "/products/product-37.png",
    link: "dejavoo-p1-desktop-android",
    inStock: true,
    tags: ["credit card terminals", "pos system"],
  },
  {
    name: "Dejavoo P3 Handheld Wireless Android Terminal",
    description:
      "Empower your business with the mobility of the Dejavoo P3 Handheld Wireless Android Terminal. This device combines the functionality of a powerful POS system with the convenience of a portable, handheld unit. Its large 5-inch HD touchscreen makes navigating applications and processing payments effortless, while its wireless capabilities ensure you can serve customers anywhere, from the shop floor to tableside. The P3 is designed to keep your business moving forward, offering a modern, efficient, and flexible payment solution for dynamic commercial environments.",
    imageSrc: "/products/product-38.png",
    link: "dejavoo-p3-handheld-wireless-android",
    inStock: true,
    tags: ["credit card terminals", "pos system", "network devices"],
  },
  {
    name: "Dejavoo P5 Handheld/PIN Pad Wireless Terminal",
    description:
      "The Dejavoo P5 offers exceptional versatility as both a handheld wireless terminal and a customer-facing PIN pad. Running on a powerful Android platform, it features a large 5-inch HD touchscreen for a smooth and intuitive user experience. This multi-functional device is designed to adapt to your needs, whether you're processing payments on the move or using it as part of a countertop setup. Its robust features and flexible design help keep your business moving forward with efficiency and modern payment technology.",
    imageSrc: "/products/product-39.png",
    link: "dejavoo-p5-handheld-pin-pad-wireless",
    inStock: true,
    tags: ["credit card terminals", "pos system", "pos accessories"],
  },
  {
    name: "Dejavoo QD1 Rigid Wireless Android Terminal",
    description:
      "The Dejavoo QD1 is a rugged and reliable wireless Android terminal built for demanding business environments. Its 'rigid' construction ensures durability while its powerful features keep your operations running smoothly. Featuring a large 5-inch HD touchscreen and powered by a robust processor, the QD1 offers a fast, secure, and user-friendly payment experience. With its dependable wireless connectivity, this terminal is an excellent choice for businesses that require a tough, high-performance device for mobile or countertop use.",
    imageSrc: "/products/product-40.png",
    link: "dejavoo-qd1-rigid-wireless-android",
    inStock: true,
    tags: ["credit card terminals", "pos system", "network devices"],
  },
  {
    name: "Dejavoo P1 Desktop Android Terminal",
    description:
      "Modernize your checkout counter with the Dejavoo P1 Desktop Android Terminal, a device designed to keep your business moving forward. It boasts a large 5-inch HD touchscreen that simplifies transaction processing and allows for the use of various business-centric Android apps. The P1 is built for speed and security, equipped with a powerful processor to handle payments quickly and efficiently. Its sleek design and advanced capabilities make it an ideal choice for merchants looking to upgrade their payment technology to a more powerful and intuitive platform.",
    imageSrc: "/products/product-41.png",
    link: "dejavoo-p1-desktop-android-2",
    inStock: true,
    tags: ["credit card terminals", "pos system"],
  },
  {
    name: "Dejavoo QD3 mPOS Android Terminal",
    description:
      "The Dejavoo QD3 is a compact and powerful mobile POS (mPOS) Android terminal designed for ultimate portability and performance. Its key features are engineered to keep your business moving forward, with a large 5-inch HD touchscreen for easy operation and a powerful processor for fast transactions. The QD3 is perfect for businesses that require a flexible payment solution, such as mobile vendors, delivery services, or restaurants with pay-at-the-table service. It combines the convenience of a smartphone with the security of a dedicated payment terminal.",
    imageSrc: "/products/product-42.png",
    link: "dejavoo-qd3-mpos-android",
    inStock: true,
    tags: ["pos system"],
  },
  {
    name: "Dejavoo QD4 Desktop Android Terminal",
    description:
      "Upgrade your countertop with the Dejavoo QD4 Desktop Android Terminal, a device built for lightning-fast performance and reliable connectivity. It offers both Ethernet and WiFi options, ensuring your business stays online and ready to process transactions. The QD4 runs on the flexible Android OS, giving you access to a world of business applications beyond simple payments. With its fast processor and user-friendly interface, this terminal is designed to keep your business moving forward, providing a seamless and efficient checkout experience for your customers.",
    imageSrc: "/products/product-43.png",
    link: "dejavoo-qd4-desktop-android",
    inStock: true,
    tags: ["credit card terminals", "pos system"],
  },
  {
    name: "Dejavoo QD5 PIN Pad Android",
    description:
      "Enhance your customer checkout experience with the Dejavoo QD5 Android PIN Pad. This device is engineered for fast and secure tap-and-go payments, featuring a vibrant customer-facing screen and a responsive keypad. Its Android-based operating system allows for a modern, interactive payment process, including on-screen signature capture and dynamic tipping options. The QD5 is designed to keep your business moving forward by speeding up transaction times and providing a secure, user-friendly interface for all card-present payments.",
    imageSrc: "/products/product-44.png",
    link: "dejavoo-qd5-pin-pad-android",
    inStock: true,
    tags: ["pos accessories", "pos system"],
  },
  {
    name: "Dejavoo Z3 PIN Pad with NFC",
    description:
      "The Dejavoo Z3 PIN Pad is a secure and efficient device designed to streamline your payment process. A key feature is its built-in NFC contactless reader, allowing customers to make quick and secure tap-to-pay transactions with their cards or mobile wallets. This feature helps to keep your business moving forward by reducing checkout times and meeting customer demand for modern payment options. The Z3 is a reliable and affordable PIN pad solution for merchants looking to enhance their existing POS system with secure PIN entry and contactless capabilities.",
    imageSrc: "/products/product-45.png",
    link: "dejavoo-z3-pinpad-with-nfc",
    inStock: true,
    tags: ["pos accessories", "pos system"],
  },
];

function page() {
  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Column 1: Text Content */}
            <div className="text-center lg:text-left">
              <h1
                className="
                text-3xl md:text-4xl font-medium leading-tight
                text-gray-900 dark:text-white
              "
              >
                Dejavoo
              </h1>
              <p
                className="
                mt-6 leading-relaxed
                text-gray-600 dark:text-gray-300
                max-w-xl mx-auto lg:mx-0
              "
              >
                Dejavoo offers some of the most innovative payment software
                solutions in the industry, designed for businesses of any size
                or from any sector.
              </p>
              <div className="mt-8">
                <button
                  className="
                  inline-flex items-center justify-center 
                  px-4 py-2 rounded-full font-semibold text-white
                  bg-gradient-to-b from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600
                  hover:opacity-90 transition-opacity duration-300 shadow-lg
                "
                >
                  Buy Our Products
                </button>
              </div>
            </div>
            <div>
              <Image
                src="/dejavoo-collage.png"
                alt="A collage of modern payment processing images"
                width={800} // Defines the aspect ratio
                height={550} // Defines the aspect ratio
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      <ProductGridLayout
        title="Dejavoo"
        totalProducts={dejavooProducts.length}
        products={dejavooProducts}
      />
    </>
  );
}

export default page;
