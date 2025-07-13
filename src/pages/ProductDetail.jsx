import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [error, setError] = useState(null)
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchProduct = async () => {
            const { data, error } = await supabase
                .from("product")
                .select("*")
                .eq("id", id)
                .single();
            if (error) {
                setError(error.message);
            } else {
                setProduct(data);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            addToCart(product);
            alert(`Produk ${product.title || product.name_product} ditambahkan ke keranjang!`);
        }
    };

    const handleBuyNow = () => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            addToCart(product);
            navigate('/cart');
        }
    };

    if (error) return <div className="text-red-600 p-4">{error}</div>
    if (!product) return <div className="p-4">Loading...</div>

    return (
        <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto mt-4 sm:mt-6">
            <img
                src={product.thumbnail || product.image_product}
                alt={product.title || product.name_product}
                className="rounded-xl mb-4 w-full h-48 sm:h-64 object-cover"
            />
            <h2 className="text-xl sm:text-2xl font-bold mb-2">{product.title || product.name_product}</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-1">Kategori: {product.category || product.size_product}</p>
            <p className="text-sm sm:text-base text-gray-600 mb-1">Brand: {product.brand || product.color_product}</p>
            <p className="text-base sm:text-lg text-gray-800 font-semibold">
                Harga: Rp {product.price ? product.price * 1000 : Number(product.price_product).toLocaleString('id-ID')}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-6">
                <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 rounded-xl font-semibold shadow text-sm sm:text-base"
                >
                    Tambah ke Cart
                </button>
                <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 sm:py-3 rounded-xl font-semibold shadow text-sm sm:text-base"
                >
                    Beli Sekarang
                </button>
            </div>
        </div>
    )
}