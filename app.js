const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// إنشاء عميل مع مصادقة محلية لحفظ الجلسة
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { 
    headless: true, // تشغيل بدون واجهة مرئية (يمكن تغييرها إلى false للتصحيح)
    args: ['--no-sandbox'] 
  }
});

// عرض QR Code عند الحاجة للمصادقة
client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

// تأكيد اتصال العميل
client.on('ready', () => {
  console.log('العميل جاهز!');
});

// البدء في الاتصال
client.initialize();

// دالة لإرسال الرسالة
async function sendMessage(phoneNumber, message) {
  try {
    // التأكد من تنسيق الرقم الدولي (مثال: 966501234567)
    const formattedNumber = phoneNumber.replace(/[^0-9]/g, '');
    const numberDetails = await client.getNumberId(formattedNumber);
    
    if (numberDetails) {
      await client.sendMessage(numberDetails._serialized, message);
      console.log('تم إرسال الرسالة بنجاح!');
    } else {
      console.log('الرقم غير موجود على واتساب');
    }
  } catch (error) {
    console.error('حدث خطأ:', error);
  }
}

// استخدام الدالة بعد اتصال العميل (مثال)
client.on('ready', () => {
  sendMessage('+201007692854', 'مرحبا! هذه رسالة تجريبية من wweb.js');
});