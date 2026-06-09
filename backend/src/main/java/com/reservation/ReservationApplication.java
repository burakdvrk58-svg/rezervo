package com.reservation;

import com.reservation.model.Role;
import com.reservation.model.Room;
import com.reservation.model.User;
import com.reservation.repository.RoomRepository;
import com.reservation.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalTime;

@SpringBootApplication(scanBasePackages = "com.reservation")
public class ReservationApplication {
    public static void main(String[] args) {
        SpringApplication.run(ReservationApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedDatabase(UserRepository userRepository, 
                                         RoomRepository roomRepository, 
                                         PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed Test Users
            userRepository.deleteAll();
            if (userRepository.count() == 0) {
                // Student
                // Customer (Student)
                User customer = new User();
                customer.setUsername("customer");
                customer.setFullName("Ahmet Yılmaz");
                customer.setEmail("customer@rezervo.com");
                customer.setPassword(passwordEncoder.encode("customer123"));
                customer.setRole(Role.ROLE_USER);
                userRepository.save(customer);

                // Business (Academician / Room Leader)
                User business = new User();
                business.setUsername("business");
                business.setFullName("Prof. Dr. Albert Ali Salah");
                business.setEmail("business@rezervo.com");
                business.setPassword(passwordEncoder.encode("business123"));
                business.setRole(Role.ROLE_ROOM_LEADER);
                userRepository.save(business);

                // Admin (Super Admin)
                User admin = new User();
                admin.setUsername("admin");
                admin.setFullName("Can Ertekin");
                admin.setEmail("admin@rezervo.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ROLE_SUPER_ADMIN);
                userRepository.save(admin);

                System.out.println("✅ Test kullanıcıları veritabanına başarıyla yüklendi!");
            }

            // Seed Test Rooms
            if (roomRepository.count() == 0) {
                // Room 1
                Room room1 = new Room();
                room1.setName("Grup Çalışma Odası 1");
                room1.setDescription("Proje çalışmaları için 6 kişilik akıllı tahta destekli oda.");
                room1.setCapacity(6);
                room1.setStartHour(LocalTime.of(9, 0));
                room1.setEndHour(LocalTime.of(18, 0));
                roomRepository.save(room1);

                // Room 2
                Room room2 = new Room();
                room2.setName("Bireysel Çalışma Kabini A");
                room2.setDescription("Sessiz çalışma için tek kişilik odaklanma alanı.");
                room2.setCapacity(1);
                room2.setStartHour(LocalTime.of(8, 30));
                room2.setEndHour(LocalTime.of(20, 0));
                roomRepository.save(room2);

                // Room 3
                Room room3 = new Room();
                room3.setName("Seminer ve Toplantı Odası");
                room3.setDescription("Sunum ve büyük grup toplantıları için 20 kişilik oda.");
                room3.setCapacity(20);
                room3.setStartHour(LocalTime.of(10, 0));
                room3.setEndHour(LocalTime.of(17, 0));
                roomRepository.save(room3);

                // Room 4
                Room room4 = new Room();
                room4.setName("Derslik 101");
                room4.setDescription("Tez sunumları ve ders intibak görüşmeleri için derslik.");
                room4.setCapacity(45);
                room4.setStartHour(LocalTime.of(8, 30));
                room4.setEndHour(LocalTime.of(17, 30));
                roomRepository.save(room4);

                // Room 5
                Room room5 = new Room();
                room5.setName("Derslik 202");
                room5.setDescription("Genel akademik danışmanlık ve grup toplantıları için derslik.");
                room5.setCapacity(30);
                room5.setStartHour(LocalTime.of(9, 0));
                room5.setEndHour(LocalTime.of(18, 0));
                roomRepository.save(room5);

                System.out.println("✅ Örnek kütüphane odaları ve derslikler veritabanına başarıyla yüklendi!");
            }
        };
    }
}