package com.reservation.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private final JavaMailSender mailSender;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendReservationMail(String toEmail, String studentName, String title, String roomName, String dateStr, String timeStr, boolean approved, String meetingUrl) {
        String subject = "Rezervo - Randevu " + (approved ? "Onaylandı" : "Reddedildi");
        String statusText = approved ? "ONAYLANDI" : "REDDEDİLDİ";
        String statusColor = approved ? "#10b981" : "#ef4444";
        
        StringBuilder htmlContent = new StringBuilder();
        htmlContent.append("<!DOCTYPE html>")
                .append("<html>")
                .append("<head>")
                .append("<meta charset='UTF-8'>")
                .append("<style>")
                .append("body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; color: #1f2937; margin: 0; padding: 0; }")
                .append(".container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; }")
                .append(".header { background: linear-gradient(135deg, #4f46e5, #6366f1); padding: 32px; text-align: center; color: #ffffff; }")
                .append(".header h1 { margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }")
                .append(".content { padding: 32px; }")
                .append(".greeting { font-size: 18px; font-weight: 700; color: #111827; margin-top: 0; margin-bottom: 8px; }")
                .append(".status-badge { display: inline-block; padding: 6px 16px; font-weight: 800; font-size: 12px; border-radius: 9999px; color: #ffffff; background-color: ").append(statusColor).append("; margin-bottom: 24px; text-transform: uppercase; }")
                .append(".details-card { background-color: #f9fafb; border-radius: 12px; padding: 24px; border: 1px solid #f3f4f6; margin-bottom: 24px; }")
                .append(".detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #e5e7eb; }")
                .append(".detail-row:last-child { border-bottom: none; }")
                .append(".label { font-weight: 700; color: #4b5563; font-size: 13px; }")
                .append(".val { color: #111827; font-size: 13px; font-weight: 600; }")
                .append(".btn { display: block; text-align: center; background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 24px; font-weight: 700; font-size: 14px; border-radius: 10px; margin-top: 24px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2); }")
                .append(".btn:hover { background-color: #4338ca; }")
                .append(".footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 11px; color: #6b7280; border-top: 1px solid #f3f4f6; }")
                .append("</style>")
                .append("</head>")
                .append("<html>")
                .append("<body>")
                .append("<div class='container'>")
                .append("  <div class='header'>")
                .append("    <h1>Rezervo</h1>")
                .append("  </div>")
                .append("  <div class='content'>")
                .append("    <p class='greeting'>Merhaba " + studentName + ",</p>")
                .append("    <p style='font-size: 14px; color: #4b5563;'>Aşağıda detayları belirtilen randevu talebinizin durumu güncellenmiştir:</p>")
                .append("    <span class='status-badge'>").append(statusText).append("</span>")
                .append("    <div class='details-card'>")
                .append("      <div class='detail-row'><span class='label'>Konu / Açıklama</span><span class='val'>").append(title).append("</span></div>")
                .append("      <div class='detail-row'><span class='label'>Oda / Akademisyen</span><span class='val'>").append(roomName).append("</span></div>")
                .append("      <div class='detail-row'><span class='label'>Tarih</span><span class='val'>").append(dateStr).append("</span></div>")
                .append("      <div class='detail-row'><span class='label'>Saat Dilimi</span><span class='val'>").append(timeStr).append("</span></div>")
                .append("    </div>");

        if (approved && meetingUrl != null) {
            htmlContent.append("    <p style='font-size: 13px; color: #4b5563;'>Görüşme saati geldiğinde aşağıdaki bağlantıyı kullanarak sanal odamıza katılabilirsiniz:</p>")
                    .append("    <a class='btn' href='http://localhost:3000").append(meetingUrl).append("' target='_blank'>Görüşme Odasına Katıl</a>");
        }

        htmlContent.append("  </div>")
                .append("  <div class='footer'>")
                .append("    Bu e-posta Rezervo sistemi tarafından otomatik olarak gönderilmiştir.<br>&copy; 2026 Rezervo Akademik Danışmanlık Portalı.")
                .append("  </div>")
                .append("</div>")
                .append("</body>")
                .append("</html>");

        String body = htmlContent.toString();

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body, true);
            mailSender.send(message);
            
            System.out.println("📧 E-posta başarıyla " + toEmail + " adresine gönderildi.");
        } catch (Exception e) {
            System.out.println("\n========================================================");
            System.out.println("⚠️ SMTP SUNUCU BAĞLANTI HATASI veya E-POSTA GÖNDERİLEMEDİ!");
            System.out.println("Sistem e-postayı göndermek yerine KONSOLA yazdırma moduna geçti.");
            System.out.println("--------------------------------------------------------");
            System.out.println("Kime: " + toEmail);
            System.out.println("Konu: " + subject);
            System.out.println("İçerik (HTML):");
            System.out.println(body);
            System.out.println("========================================================\n");
        }
    }
}
