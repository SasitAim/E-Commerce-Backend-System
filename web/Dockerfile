# FROM nginx:alpine
# COPY . /usr/share/nginx/html
# EXPOSE 80


# FROM nginx:alpine             >> ใช้ image Nginx (alpine) เป็น base         
# COPY . /usr/share/nginx/html  >>  Copy  ในโฟลเดอร์ web ไปเก็บที่ path มาตรฐานที่ Nginx 
# COPY nginx.conf /etc/nginx/conf.d/default.conf  >> เอา config Nginx (ที่อยู่ใน web/nginx.conf) ไปแทน config ค่า default
# EXPOSE 80                     >> container อยู่ที่ port 80


FROM nginx:alpine            
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
