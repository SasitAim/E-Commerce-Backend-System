# E-Commerce-Backend-System
BorntoDev Backend project.

* ชื่อโปรเจค 
  - E-Commerce-Backend-System (My Store) ของคอร์สเรียน Road to Back-End Developer จาก BorntoDev

* รายละเอียดของโปรเจกต์ 
  - เป็นโปรเจค Back-End Developer สร้างร้านค้าออนไลน์ชื่อ My Store


## เทคโนโลยีที่ใช้

* Backend Framework
  - Node.js
  - Express.js

* Database
  - MongoDB >> Database ecommerce_review 
  - MySQL	>> Database ecommerce (Table >> users, products, cart และ customer_address)

* Authentication & Security
  - JWT (JSON Web Token) สร้าง token หลังจากทำการ login เสร็จ เพื่อใช้ยืนยันตัวตนใน Request
  - Hash Password ก่อนบันทึกลง Database
  - Role-Based Access Control (RBAC) ตรวจสอบสิทธิ์ผู้ใช้ (Admin, Sales, Customer) สำหรับการเข้าถึงหน้าเว็บหรือ API

* Frontend & Static Files
  - HTML/CSS/Java Script ใช้ในการแสดงผลหน้าต่างๆ เช่น login, Product, cart, Order และอื่นๆ
 

  ## วิธีการใช้งานเบื้องต้น
  - ไปที่ http://localhost:8080 
  - ทำการ Register เพื่อสร้าง user (กรอก username, password และ confirm password) โดยการ Register นั้น user ทุกคนจะถูกตั้ง role default เป็น customer ส่วน role ของ Admin และ Sales นั้นจะไปกำหนดเองโดยการแก้ไข Database
  - ทำการ Login เพื่อเข้าใช้งาน โดยแต่ละ Role จะได้สิทธิ์ในการใช้งานต่างกันดังต่อไปนี้

 ### วิธีการใช้งาน
 * Role User
   - ทำการ Register และ Login ให้เรียบร้อย
   - สามารถเข้าไปที่หน้า Products และกด Add to Cart เพื่อเพิ่มสินค้าได้ โดยสินค้าที่เลือกจะไปอยู่ในหน้า Cart
   - ที่หน้า cart ตรวจสอบจำนวนสิ้นค้าในรถเข็น และกรอกข้อมูลที่อยู่ (Billing address) ให้เรียบร้อย จากนั้นกด Continue to checkout
   - สามารถตรวจสอบ Order ได้ที่หน้า Orders โดยกดที่ปุ่ม Find your orders จะแสดง Order ทั้งหมดที่ user คนนั้นเคยสั่งไว้ โดย Order แต่ละรายการจะแสดง Order id, user_id ที่สั่งซื้อ, วันที่สร้าง order, ราคารวมของ order นั้นๆ และรายละเอียดสินค้าแต่ละชิ้นใน Order
  
### วิธีการใช้งาน
* Role Sales
  - ทำการ Login ให้เรียบร้อย 
  - ไปที่หน้า Products สามารถกดปุ่มเพิ่มรายการสินค้าได้ โดยต้องใส่รายละเอียดสินค้าที่จะเพิ่มได้แก่ ชื่อสินค้า, รายละเอียดสินค้า, รูปภาพสินค้า (url), ราคา และ จำนวน จากนั้นกดเพิ่มรายการ
  - สามารถกด Update ที่ card ของสินค้า เพื่อแก้ไขข้อมูลสินค้า และสามารถกด Delete เพื่อลบสินค้านั้นได้ โดยกด Delete จากนั้นจะมีคำถาม เพื่อยืนยันการลบสินค้า

### วิธีการใช้งาน
* Role Admin
  - ทำการ Login ให้เรียบร้อย 
  - ไปที่หน้า Products สามารถกดปุ่มเพิ่มรายการสินค้าได้ โดยต้องใส่รายละเอียดสินค้าที่จะเพิ่มได้แก่ ชื่อสินค้า, รายละเอียดสินค้า, รูปภาพสินค้า (url), ราคา และ จำนวน จากนั้นกดเพิ่มรายการ
  - สามารถกด Update ที่ card ของสินค้า เพื่อแก้ไขข้อมูลสินค้า และสามารถกด Delete เพื่อลบสินค้านั้นได้ โดยกด Delete จากนั้นจะมีคำถาม เพื่อยืนยันการลบสินค้า
  - ไปที่หน้า Orders สามารถกด Find your orders เพื่อแสดงรายการ Order สินค้าทั้งหมดได้ และลบรายการ Order ได้เมื่อกดปุ่ม Delete ที่รายการ Order นั้น
