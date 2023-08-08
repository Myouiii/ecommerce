### Client app
- Mở command line (terminal) tại thư mục `client`
- Dùng lệnh sau để cài đặt các package trong project
    #### `npm ci`
- Tạo file `.env` trong thư mục `client` với các biến sau

	|Tên biến                    |Bắt buộc |Mô tả                                   |Mặc định                     |
	|----------------------------|---------|----------------------------------------|-----------------------------|
	|PORT                        |❌       |Port để listen (lắng nghe) client app   |3000                         |
	|REACT_APP_API_BASE_URL      |❌       |Base URL của api                        |http://localhost:3001/api/v1 |
	|REACT_APP_FIREBASE_CONFIG   |✔       |Firebase config (*)                     |                             |

	(*) REACT_APP_FIREBASE_CONFIG có dạng chuỗi được JSON.stringify từ object config
	
	Ví dụ:
	```json
	objectConfig = {
    "databaseURL": "gs://fb-pro-10.appspot.com",
    "apiKey": "xxx",
    "authDomain": "fb-pro-10.firebaseapp.com",
    "projectId": "fb-pro-10",
    "storageBucket": "fb-pro-10.appspot.com",
    "messagingSenderId": "111",
    "appId": "1:11:web:abcd",
    "measurementId": "G-HJJH"
	}
	```
	=> `REACT_APP_FIREBASE_CONFIG={"databaseURL":"gs://fb-pro-10.appspot.com","apiKey":"xxx","authDomain":"fb-pro-10.firebaseapp.com","projectId":"fb-pro-10","storageBucket":"fb-pro-10.appspot.com","messagingSenderId":"111","appId":"1:11:web:abcd","measurementId":"G-HJJH"}`
- Dùng lệnh sau để build ứng dụng
    #### `npm run build`
- Cài đặt thư viện serve và chạy app
    #### `npm install -g serve`
	#### `serve -d build`
  ```

