"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ShoppingCart,
  Search,
  Download,
  Eye,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Package,
  Truck,
  ArrowLeft,
} from "lucide-react"

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: OrderItem[]
  date: string
  paymentMethod: string
  paymentStatus: "paid" | "pending" | "failed"
  trackingNumber?: string
}

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  // Sample data - replace with actual API call
  useEffect(() => {
    setTimeout(() => {
      setOrders([
        {
          id: "ORD-001",
          customerName: "John Doe",
          customerEmail: "john@example.com",
          customerPhone: "+1 (555) 123-4567",
          shippingAddress: "123 Main St, New York, NY 10001",
          total: 299.99,
          status: "processing",
          items: [
            {
              id: "1",
              name: "Wireless Headphones",
              price: 199.99,
              quantity: 1,
              image: "/placeholder.svg?height=60&width=60&text=Headphones",
            },
            {
              id: "2",
              name: "Phone Case",
              price: 29.99,
              quantity: 2,
              image: "/placeholder.svg?height=60&width=60&text=Case",
            },
          ],
          date: "2024-01-25",
          paymentMethod: "Credit Card",
          paymentStatus: "paid",
          trackingNumber: "TRK123456789",
        },
        {
          id: "ORD-002",
          customerName: "Jane Smith",
          customerEmail: "jane@example.com",
          customerPhone: "+1 (555) 987-6543",
          shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
          total: 159.99,
          status: "shipped",
          items: [
            {
              id: "3",
              name: "Smart Watch",
              price: 159.99,
              quantity: 1,
              image: "/placeholder.svg?height=60&width=60&text=Watch",
            },
          ],
          date: "2024-01-24",
          paymentMethod: "PayPal",
          paymentStatus: "paid",
          trackingNumber: "TRK987654321",
        },
        {
          id: "ORD-003",
          customerName: "Bob Johnson",
          customerEmail: "bob@example.com",
          customerPhone: "+1 (555) 456-7890",
          shippingAddress: "789 Pine St, Chicago, IL 60601",
          total: 89.99,
          status: "delivered",
          items: [
            {
              id: "4",
              name: "Bluetooth Speaker",
              price: 89.99,
              quantity: 1,
              image: "/placeholder.svg?height=60&width=60&text=Speaker",
            },
          ],
          date: "2024-01-23",
          paymentMethod: "Credit Card",
          paymentStatus: "paid",
          trackingNumber: "TRK456789123",
        },
        {
          id: "ORD-004",
          customerName: "Sarah Wilson",
          customerEmail: "sarah@example.com",
          customerPhone: "+1 (555) 321-0987",
          shippingAddress: "321 Elm St, Miami, FL 33101",
          total: 449.99,
          status: "pending",
          items: [
            {
              id: "5",
              name: "Laptop",
              price: 399.99,
              quantity: 1,
              image: "/placeholder.svg?height=60&width=60&text=Laptop",
            },
            {
              id: "6",
              name: "Mouse",
              price: 49.99,
              quantity: 1,
              image: "/placeholder.svg?height=60&width=60&text=Mouse",
            },
          ],
          date: "2024-01-25",
          paymentMethod: "Bank Transfer",
          paymentStatus: "pending",
        },
        {
          id: "ORD-005",
          customerName: "Mike Davis",
          customerEmail: "mike@example.com",
          customerPhone: "+1 (555) 654-3210",
          shippingAddress: "654 Maple Dr, Seattle, WA 98101",
          total: 199.99,
          status: "cancelled",
          items: [
            {
              id: "7",
              name: "Gaming Keyboard",
              price: 129.99,
              quantity: 1,
              image: "/placeholder.svg?height=60&width=60&text=Keyboard",
            },
            {
              id: "8",
              name: "Gaming Mouse",
              price: 69.99,
              quantity: 1,
              image: "/placeholder.svg?height=60&width=60&text=Gaming+Mouse",
            },
          ],
          date: "2024-01-22",
          paymentMethod: "Credit Card",
          paymentStatus: "failed",
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredOrders = orders
    .filter(
      (order) =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((order) => statusFilter === "" || order.status === statusFilter)

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
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "processing":
        return <Package className="w-4 h-4" />
      case "shipped":
        return <Truck className="w-4 h-4" />
      case "delivered":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus as any } : order)))
  }

  const deleteOrder = (orderId: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      setOrders(orders.filter((order) => order.id !== orderId))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading orders...</p>
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
              <Link
                href="/admin"
                className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Orders Management</h1>
                <p className="text-slate-600 mt-1">Track and manage customer orders</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-slate-800">{orders.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {orders.filter((o) => o.status === "pending").length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Processing</p>
                <p className="text-2xl font-bold text-blue-600">
                  {orders.filter((o) => o.status === "processing").length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter((o) => o.status === "delivered").length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50 hover:bg-white focus:bg-white outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50 hover:bg-white focus:bg-white outline-none"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-slate-800">{order.id}</div>
                        <div className="text-sm text-slate-600">{order.date}</div>
                        <div className="text-sm text-slate-500">{order.paymentMethod}</div>
                        {order.trackingNumber && (
                          <div className="text-sm text-blue-600">Tracking: {order.trackingNumber}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-slate-800">{order.customerName}</div>
                        <div className="text-sm text-slate-600">{order.customerEmail}</div>
                        <div className="text-sm text-slate-500">{order.customerPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <img
                            key={index}
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-8 h-8 rounded-full border-2 border-white object-cover"
                            title={item.name}
                          />
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">{order.items.length} items</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">${order.total.toFixed(2)}</div>
                      <div
                        className={`text-sm ${
                          order.paymentStatus === "paid"
                            ? "text-green-600"
                            : order.paymentStatus === "pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {order.paymentStatus}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`text-sm font-semibold rounded-full px-3 py-1 border-0 outline-none ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          title="View Order"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          title="Edit Order"
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          title="Delete Order"
                          onClick={() => deleteOrder(order.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
