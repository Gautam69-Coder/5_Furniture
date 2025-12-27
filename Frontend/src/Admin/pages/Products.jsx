import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useEffect } from 'react';

const Products = () => {
    const [view, setView] = useState('list');
    const [productsData, setProductsData] = useState([]);
    const [addProduct, setaddProduct] = useState(true);
    const [search, setsearch] = useState("")
    const [filteredProducts, setFilteredProducts] = useState([]);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log("hello")
                const res = await axios.get('/api/v1/product');
                console.log(res.data.data);
                setProductsData(res.data.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);


    useEffect(() => {
        if (!search) {
            setFilteredProducts(productsData)
        }

        const searchText = search.toLowerCase();

        const filtered = productsData.filter((item) => {

            const products = `${item.name || ""}`.toLowerCase();

            return (products.includes(searchText));
        })

        setFilteredProducts(filtered);
    }, [search, productsData])



    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-brand-dark font-display">Products</h1>
                    <p className="text-gray-500 mt-1">Manage your product catalog</p>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg shadow-lg hover:bg-brand-primary/90 transition-all font-medium">
                    <Plus size={20} />
                    <span onClick={() => { setaddProduct(true) }}>Add Product</span>
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative flex-1 w-full md:max-w-md">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                        value={search}
                        onChange={(e) => {
                            setsearch(e.target.value)
                        }}
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium">
                        <Filter size={18} />
                        <span>Filters</span>
                    </button>
                </div>
            </div>

            {/* Product List */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden">
                                            <img src={product?.images} alt="" className="h-full w-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">{product.name}</div>
                                            <div className="text-xs text-gray-500">ID: #{product.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{product.category.charAt(0).toUpperCase() + product.category.slice(1).toLowerCase()}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${product.status === 'In Stock' ? 'bg-green-50 text-green-700 border-green-200' :
                                        product.status === 'Low Stock' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                            'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                    ${product.price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.stock} units
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-1.5 hover:bg-white text-gray-400 hover:text-brand-primary rounded-lg transition-colors border border-transparent hover:border-gray-200 hover:shadow-sm">
                                            <Edit size={16} />
                                        </button>
                                        <button className="p-1.5 hover:bg-white text-gray-400 hover:text-red-500 rounded-lg transition-colors border border-transparent hover:border-gray-200 hover:shadow-sm">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;
