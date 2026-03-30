const BASE_URL = "https://midguard-backend-production.up.railway.app/";
const Auth_URL = `https://midguard-backend-production.up.railway.app/Auth`;

export const api = {

  //LOGIN API
  login: async (data: any) => {
    const res = await fetch(`${Auth_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },

  //SIGNUP API
  register: async (data: any) => {
    const res = await fetch(`${Auth_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },

  //LOGOUT API
  logout: async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${Auth_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.json();
  },

  //Create Room API
  createRoom: async (data: any) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },

  //Product Image Upload API
  uploadAsset: async (formData: FormData) => {
    return fetch(`${BASE_URL}assets/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    }).then(res => res.json());
  },

  //Auth
  getMe: async () => {
    const res = await fetch(`${BASE_URL}auth/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return res.json();
  },

  //wallet API
  getWallet: async () => {
    const res = await fetch(`${BASE_URL}wallet`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return res.json();
  },

  //Ledger API
  getLedger: async () => {
    const res = await fetch(`${BASE_URL}wallet/ledger`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    return res.json();
  },

  // GET MESSAGES
  getMessages: async (sessionId: string) => {
    const res = await fetch(
      `${BASE_URL}sessions/${sessionId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      console.error("❌ getMessages failed:", data);
      throw new Error(data.error || "Failed to fetch messages");
    }

    return data.data || [];
  },

  // SEND MESSAGE
  sendMessage: async (sessionId: string, body: string) => {
    if (!body || body.trim().length === 0) {
      throw new Error("Message cannot be empty");
    }

    const res = await fetch(
      `${BASE_URL}sessions/${sessionId}/messages/text`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ body: body.trim() }),
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      console.error("❌ sendMessage failed:", data);
      throw new Error(data.error || "Failed to send message");
    }

    if (!data.data || !data.data.message) {
      console.error("❌ Invalid message response:", data);
      throw new Error("Invalid message response");
    }

    return data.data.message;
  },

  // Product details APIs
  getRoom: async (roomId: string) => {
    const res = await fetch(
      `${BASE_URL}rooms/${roomId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return res.json();
  },

  // ASSET APIs
  getRoomAssets: async (roomId: string) => {
    const res = await fetch(
      `${BASE_URL}assets?context_type=room&context_id=${roomId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return res.json();
  },

  //BID APIs
  getBids: async (roomId: string) => {
    const res = await fetch(
      `${BASE_URL}bids/room/${roomId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return res.json();
  },

  placeBid: async (roomId: string, amount: number) => {
    const res = await fetch(`${BASE_URL}bids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        room_uid: roomId,
        bid_amount: amount,
      }),
    });

    return res.json();
  },

  createBuyOrder: async (roomUid: string, addressUid: string, amount: number, sellerId: string) => {
    const res = await fetch(`${BASE_URL}orders/buy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        room_uid: roomUid,
        amount,
        seller_public_id: sellerId,
        address_uid: addressUid,
      }),
    });

    return res.json();
  },

// ================= ADDRESS APIs =================

// CREATE ADDRESS
createAddress: async (data: any) => {
  const res = await fetch(`${BASE_URL}address`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
},

// GET ALL ADDRESSES
getAddresses: async () => {
  const res = await fetch(`${BASE_URL}address`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return res.json();
},

// DELETE ADDRESS
deleteAddress: async (address_uid: string) => {
  const res = await fetch(`${BASE_URL}address/${address_uid}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return res.json();
},

// SET DEFAULT ADDRESS
setDefaultAddress: async (address_uid: string) => {
  const res = await fetch(`${BASE_URL}address/default`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ address_uid }),
  });

  return res.json();
},

  // ESCROW APIs
  getEscrow: async (sessionId: string) => {
    const res = await fetch(`${BASE_URL}escrow/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return res.json();
  },

  shipOrder: async (sessionId: string, data: any) => {
    const res = await fetch(`${BASE_URL}escrow/${sessionId}/ship`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },

  confirmDelivery: async (sessionId: string) => {
    const res = await fetch(`${BASE_URL}escrow/${sessionId}/confirm`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return res.json();
  },

  confirmDigitalDelivery: async (sessionId: string) => {
    const res = await fetch(`${BASE_URL}escrow/${sessionId}/digital-delivery`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return res.json();
  },

  raiseDispute: async (sessionId: string, reason: string) => {
    const res = await fetch(`${BASE_URL}escrow/${sessionId}/dispute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ reason }),
    });

    return res.json();
  },

  getNotifications: async () => {
    const res = await fetch(`${BASE_URL}notifications`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return res.json();
  },

  markNotificationRead: async (notificationId: string) => {
    const res = await fetch(`${BASE_URL}notifications/read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ notificationId }),
    });

    return res.json();
  },

  getMyOrders: async () => {
    const res = await fetch(`${BASE_URL}orders/my`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return res.json();
  },

  getSellerOrders: async () => {
    const res = await fetch(`${BASE_URL}orders/seller`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return res.json();
  },

  toggleWishlist: async (roomUid: string) => {
    const res = await fetch(`${BASE_URL}wishlist/toggle/${roomUid}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return res.json();
  },

  getWishlist: async () => {
    const res = await fetch(`${BASE_URL}wishlist`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to fetch wishlist");
    }

    return data.data || [];
  },

  isWishlisted: async (roomUid: string) => {
    const res = await fetch(`${BASE_URL}wishlist/check/${roomUid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to check wishlist");
    }

    return data.isWishlisted;
  },

  activateRoom: async (roomUid: string) => {
    const res = await fetch(`${BASE_URL}rooms/${roomUid}/activate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return res.json();
  },

  joinPrivateRoom: async (roomUid: string, password: string) => {
    const res = await fetch(`${BASE_URL}rooms/${roomUid}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ password }),
    });

    return res.json();
  },

  getDashboardStats: async () => {
    const res = await fetch(`${BASE_URL}api/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to fetch dashboard stats");
    }

    return data.data;
  },

  // GET ALL ROOMS (LIST)
  getRooms: async () => {
  const res = await fetch(`${BASE_URL}rooms`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch rooms");
  }

  return data.data || [];
  },
};
