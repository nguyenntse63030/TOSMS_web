module.exports = {
  treeProblem: {
    BROKEN_BRANCH: "broken_branch",
    INCLINED_TREE: "inclined_tree",
    ELECTRIC_WIRE: "electric_wire",
    KITE: "kite",
    SYRINGE: "syringe",
    TREE_BODY: "tree_body",
  },

  treeProblemDisplay: {
    BROKEN_BRANCH: "Cây bị gãy cành",
    INCLINED_TREE: "Cây bị nghiêng",
    ELECTRIC_WIRE: "Cây có vật lạ",
    KITE: "Cây có vật lạ",
    SYRINGE: "Cây có vật lạ",
    CANT_DETECT: 'Camera hoặc cây có vấn đề',
    NO_PROBLEM: "Cây bình thường",
  },
  
  TREE_NOT_DESCRIPTION: "Không có",
  userRoles: {
    ADMIN: "admin",
    MANAGER: "manager",
    WORKER: "worker",
  },

  userRolesEnums: ["admin", "manager", "worker"],

  priorityStatus: {
    CHUA_XU_LY: "Chưa Xử Lý",
    DANG_XU_LY: "Đang Xử Lý",
    DA_XU_LY: "Đã Xử Lý",
  },

  priorityStatuEnums: ["Chưa Xử Lý", "Đang Xử Lý", "Đã Xử Lý"],

  cameraStatus: {
    DANG_HOAT_DONG: "Đang hoạt động",
    BI_LOI: "Bị lỗi",
  },
  gender: {
    Male: "Nam",
    Female: "Nữ",
  },
  genderEnums: ["Nam", "Nữ"],
  cameraStatusEnums: ["Đang hoạt động", "Bị lỗi"],
  imageDefault: "/images/logo/LogoTree.jpg",
  googleMapsURL: "https://www.google.com/maps/dir/?api=1&destination=",
  type_func: {
    CREATE: 'create',
    UPDATE: 'update'
  },
  notiCollection: {
    MANAGER: "manager",
    WORKER: "worker"
  }
};
