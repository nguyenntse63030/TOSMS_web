module.exports = {
  Code200: (object) => {
    return Object.assign(
      {
        status: 200,
      },
      object
    );
  },

  Code201: (object) => {
    return Object.assign(
      {
        status: 201,
        message: "OK: New resource has been created",
      },
      object
    );
  },

  Code204: (object) => {
    return Object.assign(
      {
        status: 204,
        message: "OK: The resource was successfully deleted",
      },
      object
    );
  },

  Code304: (object) => {
    return Object.assign(
      {
        status: 304,
        errorMessage: "Not Modified: The client can use cached data",
      },
      object
    );
  },

  Code400: (object) => {
    return Object.assign(
      {
        status: 400,
        errorMessage: "Đã xảy ra lỗi. Kiểm tra lại parameters",
      },
      object
    );
  },

  Code401: (object) => {
    return Object.assign(
      {
        status: 401,
        errorMessage:
          "Unauthorized: The request requires an user authentication",
      },
      object
    );
  },

  Code403: (object) => {
    return Object.assign(
      {
        status: 403,
        errorMessage:
          "Forbidden: The server understood the request, but is refusing it or the access is not allowed",
      },
      object
    );
  },

  Code404: (object) => {
    return Object.assign(
      {
        status: 404,
        errorMessage: "Not found: There is no resource behind the URI.",
      },
      object
    );
  },

  Code406: (object) => {
    return Object.assign(
      {
        status: 406,
        errorMessage: "Not Acceptable",
      },
      object
    );
  },

  Code409: (object) => {
    return Object.assign(
      {
        status: 409,
        errorMessage:
          "Conflict: Request conflict with current state of the server.",
      },
      object
    );
  },

  Code422: (object) => {
    return Object.assign(
      {
        status: 422,
        errorMessage:
          "Invalid Entity – Should be used if the server cannot process the entity",
      },
      object
    );
  },

  Code500: (object) => {
    return Object.assign(
      {
        status: 500,
        errorMessage:
          "Internal Server Error: API developers should avoid this error",
      },
      object
    );
  },

  Code502: (object) => {
    return Object.assign(
      {
        status: 502,
        errorMessage:
          "Bad Gateway: This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response",
      },
      object
    );
  },

  Code504: (object) => {
    return Object.assign(
      {
        status: 504,
        errorMessage:
          "Gateway Timeout: This error response is given when the server is acting as a gateway and cannot get a response in time",
      },
      object
    );
  },

  IVALID_USERNAME_OR_PASSWORD: "Username hoặc Password không đúng",
  INVALID_REQUEST: "Yêu cầu không hợp lệ",
  UPLOAD_IMAGE_FAIL: "Upload Image To S3 Faild",
  UPLOAD_IMAGE_SUCCESSFULLY: "Upload Image To S3 Successfully",
  FILES_IS_NOT_FOUND: "Files is not found",
  PROCESS_DATA_FROM_PYTHON_SUCCESSFULLY: "Process data successfully",
  DATA_IS_NOT_FOUND: "Data is not found",
  CONNECTION_TO_DB_FAIL: "Fail to connect DB",
  CREATE_NOTIFICATION_FAIL: "Create notirication fail",
  CREATE_NOTIFICATION_SUCCESSFULLY: "Create notirication successfully",
  NOTIFICATION_IS_NOT_FOUND: "Notification không tồn tại",
  TREE_IMAGE_IS_CANT_EMPTY: "Bạn phải chọn ảnh của cây trước khi tạo.",
  TREE_TYPE_IS_CANT_EMPTY: "Loại cây không thể bỏ trống.",
  TREE_STREET_IS_CANT_EMPTY: "Tên đường không thể bỏ trống.",
  TREE_CITY_IS_CANT_EMPTY: "Thành phố không thể bỏ trống.",
  TREE_DISTRICT_IS_CANT_EMPTY: "Quận/huyện không thể bỏ trống.",
  TREE_WARD_IS_CANT_EMPTY: "Phường/xã không thể bỏ trống",
  TREE_IS_NOT_FOUND: "Cây không tồn tại",
  TREE_CODE_CANT_EMPTY: "Code của cây không thể bỏ trống",
  TREE_CODE_IS_DUPLICATE: "Mã code của cây đã tồn tại vui lòng chọn mã khác",
  TREE_UPLOAD_IMAGE_FAIL: "Upload ảnh cây thất bại",
  TREE_UPLOAD_IMAGE_SUCCESS: "Upload ảnh cây thành công",
  UPDATE_TREE_FAIL: "Cập nhật thông tin cây thất bại",
  DELETE_TREE_FAIL: "Xóa cây thất bại",
  DELETE_TREE_SUCCESS: "Xóa cây thành công",
  UPDATE_TREE_SUCCESS: "Cập nhật thông tin cây thành công",
  CAMERA_CODE_IS_CANT_EMPTY: "Camera code không thể bỏ trống",
  CAMERA_CODE_IS_CANT_DUPLICATE:
    "Camera code đã tồn tại vui lòng dổi tên code khác.",
  CAMERA_IP__IS_CANT_EMPTY: "Camera IP không thể bỏ trống",
  CAMERA_IMAGE__IS_CANT_EMPTY: "Bạn phải chọn ảnh của camera trước khi tạo.",
  CAMERA_CREATE_FAIL: "Có lỗi trong quá trình tạo, vui lòng thử lại.",
  CAMERA_CREATE_SUCCESS: "Tạo camera thành công.",
  USER_IS_NOT_FOUND: "Người dùng không tồn tại",
  TREE_ONLY_HAVE_ONE_CAMERA:
    "Cây đã có một camera bạn vui lòng xóa, thay đổi camera từ cây hoặc vui lòng chọn cây khác.",
  LOCATION_WRONG: "Thông tin vị trí không đúng vui lòng thử lại.",
  CAMERA_IS_NOT_FOUND: "Camera không tồn tại",
  UPDATE_CAMERA_FAIL: "Cập nhật thông tin camera thất bại",
  UPDATE_CAMERA_SUCCESS: "Cập nhật thông tin camera thành công",
  DELETE_CAMERA_FAIL: "Xóa camera thất bại",
  DELETE_CAMERA_SUCCESS: "Xóa camera thành công",
  USERNAME_IS_CANT_DUPLICATE:
    "Tài khoản đã tồn tại vui lòng đổi tài khoản khác.",
  USER_CREATE_FAIL: "Có lỗi trong quá trình tạo, vui lòng thử lại.",
  USER_CREATE_SUCCESS: "Tạo người dùng thành công.",
  USER_UPLOAD_IMAGE_FAIL: "Upload ảnh người dùng thất bại",
  USER_UPLOAD_IMAGE_SUCCESS: "Upload ảnh người dùng thành công",
  USER_IS_NOT_FOUND: "Người dùng không tồn tại",
  DELETE_USER_FAIL: "Xóa người dùng thất bại",
  DELETE_USER_SUCCESS: "Xóa người dùng thành công",
  UPDATE_USER_FAIL: "Cập nhật thông tin người dùng thất bại",
  UPDATE_USER_SUCCESS: "Cập nhật thông tin người dùng thành công",
  CAMERA_UPLOAD_IMAGE_FAIL: "Upload ảnh camera thất bại",
  CAMERA_UPLOAD_IMAGE_SUCCESS: "Upload ảnh camera thành công",
  USER_FULLNAME_IS_CANT_EMPTY: "Tên người dùng không thể bỏ trống",
  USER_ROLE_IS_CANT_EMPTY: "Chức vụ không thể bỏ trống",
  USER_IMAGE_IS_CANT_EMPTY: "Bạn phải chọn ảnh của người dùng trước khi tạo.",
  USER_USERNAME_IS_CANT_EMPTY: "Tên tài khoản không thể bỏ trống",
  USER_PASSWORD_IS_CANT_EMPTY: "Mật khẩu không thể bỏ trống",
  SET_WORKER_TO_NOTI_SUCCESS: "Lựa chọn công nhân phụ trách vấn đề được thông báo thành công.",
  SET_NOTI_STATUS_SUCCESS: "Công việc đã được xác nhận bởi hệ thống.",
  ERRO_SET_NOTI_STATUS: "Thông báo này không dành cho bạn hoặc đã được hoàn thành."
};
