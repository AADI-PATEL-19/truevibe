"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Eye,
  Edit3,
  Plus,
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface DashboardProps {
  session: any
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: number
  date: string
  paymentMethod: string
}

interface Product {
  id: string
  name: string
  price: number
  stock: number
  sales: number
  status: "active" | "inactive" | "out_of_stock"
}

interface Customer {
  id: string
  name: string
  email: string
  orders: number
  totalSpent: number
  lastOrder: string
  status: "active" | "inactive"
}

export default function AdminDashboard({ session }: DashboardProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("overview")

  // Sample data - replace with actual API calls
  useEffect(() => {
    setTimeout(() => {
      setOrders([
        {
          id: "ORD-001",
          customerName: "John Doe",
          customerEmail: "john@example.com",
          total: 299.99,
          status: "processing",
          items: 3,
          date: "2024-01-25",
          paymentMethod: "Credit Card",
        },
        {
          id: "ORD-002",
          customerName: "Jane Smith",
          customerEmail: "jane@example.com",
          total: 159.99,
          status: "shipped",
          items: 2,
          date: "2024-01-24",
          paymentMethod: "PayPal",
        },
        {
          id: "ORD-003",
          customerName: "Bob Johnson",
          customerEmail: "bob@example.com",
          total: 89.99,
          status: "delivered",
          items: 1,
          date: "2024-01-23",
          paymentMethod: "Credit Card",
        },
        {
          id: "ORD-004",
          customerName: "Sarah Wilson",
          customerEmail: "sarah@example.com",
          total: 449.99,
          status: "pending",
          items: 5,
          date: "2024-01-25",
          paymentMethod: "Bank Transfer",
        },
        {
          id: "ORD-005",
          customerName: "Mike Davis",
          customerEmail: "mike@example.com",
          total: 199.99,
          status: "cancelled",
          items: 2,
          date: "2024-01-22",
          paymentMethod: "Credit Card",
        },
      ])

      setProducts([
        {
          id: "1",
          name: "Wireless Headphones",
          price: 299.99,
          stock: 25,
          sales: 45,
          status: "active",
        },
        {
          id: "2",
          name: "Smart Watch",
          price: 399.99,
          stock: 0,
          sales: 32,
          status: "out_of_stock",
        },
        {
          id: "3",
          name: "Laptop Stand",
          price: 79.99,
          stock: 15,
          sales: 28,
          status: "active",
        },
        {
          id: "4",
          name: "USB-C Cable",
          price: 19.99,
          stock: 100,
          sales: 156,
          status: "active",
        },
        {
          id: "5",
          name: "Bluetooth Speaker",
          price: 149.99,
          stock: 8,
          sales: 67,
          status: "active",
        },
      ])

      setCustomers([
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          orders: 5,
          totalSpent: 1299.95,
          lastOrder: "2024-01-25",
          status: "active",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          orders: 3,
          totalSpent: 599.97,
          lastOrder: "2024-01-24",
          status: "active",
        },
        {
          id: "3",
          name: "Bob Johnson",
          email: "bob@example.com",
          orders: 2,
          totalSpent: 189.98,
          lastOrder: "2024-01-23",
          status: "active",
        },
      ])

      setLoading(false)
    }, 1000)
  }, [])

  const stats = {
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: orders.length,
    totalProducts: products.length,
    totalCustomers: customers.length,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    lowStockProducts: products.filter((p) => p.stock < 10 && p.stock > 0).length,
    outOfStockProducts: products.filter((p) => p.stock === 0).length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "out_of_stock":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
      case "out_of_stock":
        return <XCircle className="w-4 h-4" />
      case "pending":
      case "processing":
        return <Clock className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
                <p className="text-slate-600 mt-1">Welcome back, {session.user?.name}!</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6" />
                {stats.pendingOrders > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.pendingOrders}
                  </span>
                )}
              </button>

              <Link
                href="/admin/products/add"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-slate-800">${stats.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">+12.5%</span>
                  <span className="text-sm text-slate-500">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-slate-800">{stats.totalOrders}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">+8.2%</span>
                  <span className="text-sm text-slate-500">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold text-slate-800">{stats.totalProducts}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">-2.1%</span>
                  <span className="text-sm text-slate-500">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Package className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Customers</p>
                <p className="text-3xl font-bold text-slate-800">{stats.totalCustomers}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">+15.3%</span>
                  <span className="text-sm text-slate-500">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/products"
            className="group bg-white rounded-2xl shadow-xl border border-slate-200 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Manage Products</h3>
                <p className="text-slate-600 text-sm mb-4">Add, edit, or remove products from your inventory</p>
                <div className="flex items-center gap-2 text-blue-600 font-medium">
                  <span>Go to Products</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className="group bg-white rounded-2xl shadow-xl border border-slate-200 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">View Orders</h3>
                <p className="text-slate-600 text-sm mb-4">Track and manage customer orders and shipments</p>
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <span>Go to Orders</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <ShoppingCart className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </Link>

          <Link
            href="/admin/customers"
            className="group bg-white rounded-2xl shadow-xl border border-slate-200 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Customer Management</h3>
                <p className="text-slate-600 text-sm mb-4">View customer profiles and purchase history</p>
                <div className="flex items-center gap-2 text-purple-600 font-medium">
                  <span>Go to Customers</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </Link>
        </div>

        {/* Alerts */}
        {(stats.pendingOrders > 0 || stats.lowStockProducts > 0 || stats.outOfStockProducts > 0) && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Alerts & Notifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.pendingOrders > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">Pending Orders</span>
                  </div>
                  <p className="text-yellow-700 text-sm">
                    You have {stats.pendingOrders} pending orders that need attention
                  </p>
                </div>
              )}

              {stats.lowStockProducts > 0 && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold text-orange-800">Low Stock</span>
                  </div>
                  <p className="text-orange-700 text-sm">{stats.lowStockProducts} products are running low on stock</p>
                </div>
              )}

              {stats.outOfStockProducts > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-800">Out of Stock</span>
                  </div>
                  <p className="text-red-700 text-sm">{stats.outOfStockProducts} products are out of stock</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200">
            <nav className="flex">
              <button
                onClick={() => setSelectedTab("overview")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === "overview"
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedTab("orders")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === "orders"
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                Recent Orders
              </button>
              <button
                onClick={() => setSelectedTab("products")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === "products"
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                Top Products
              </button>
              <button
                onClick={() => setSelectedTab("customers")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === "customers"
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                Top Customers
              </button>
            </nav>
          </div>

          <div className="p-6">
            {selectedTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                    <h4 className="text-lg font-semibold mb-4">Sales Overview</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Today's Sales</span>
                        <span className="font-semibold">$1,234.56</span>
                      </div>
                      <div className="flex justify-between">
                        <span>This Week</span>
                        <span className="font-semibold">$8,765.43</span>
                      </div>
                      <div className="flex justify-between">
                        <span>This Month</span>
                        <span className="font-semibold">${stats.totalRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                    <h4 className="text-lg font-semibold mb-4">Order Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Pending Orders</span>
                        <span className="font-semibold">{stats.pendingOrders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing</span>
                        <span className="font-semibold">{orders.filter((o) => o.status === "processing").length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completed</span>
                        <span className="font-semibold">{orders.filter((o) => o.status === "delivered").length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === "orders" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">Recent Orders</h3>
                  <Link
                    href="/admin/orders"
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    View All <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-slate-800">{order.id}</td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-slate-800">{order.customerName}</div>
                              <div className="text-sm text-slate-500">{order.customerEmail}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-800">${order.total.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}
                            >
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{order.date}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors">
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedTab === "products" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">Top Selling Products</h3>
                  <Link
                    href="/admin/products"
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    View All <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products
                    .sort((a, b) => b.sales - a.sales)
                    .slice(0, 6)
                    .map((product) => (
                      <div key={product.id} className="border border-slate-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-slate-800">{product.name}</h4>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}
                          >
                            {getStatusIcon(product.status)}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Price:</span>
                            <span className="font-semibold">${product.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Stock:</span>
                            <span
                              className={`font-semibold ${
                                product.stock === 0
                                  ? "text-red-600"
                                  : product.stock < 10
                                    ? "text-yellow-600"
                                    : "text-green-600"
                              }`}
                            >
                              {product.stock}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Sales:</span>
                            <span className="font-semibold text-blue-600">{product.sales}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {selectedTab === "customers" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">Top Customers</h3>
                  <Link
                    href="/admin/customers"
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    View All <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {customers
                    .sort((a, b) => b.totalSpent - a.totalSpent)
                    .map((customer) => (
                      <div
                        key={customer.id}
                        className="flex items-center justify-between p-4 border border-slate-200 rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800">{customer.name}</h4>
                            <p className="text-sm text-slate-600">{customer.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-800">${customer.totalSpent.toLocaleString()}</p>
                          <p className="text-sm text-slate-600">{customer.orders} orders</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
