package com.iit.trainingcenter.util;

import com.iit.trainingcenter.entity.Specialization;
import com.iit.trainingcenter.entity.Student;
import com.iit.trainingcenter.entity.Trainer;
import com.iit.trainingcenter.repository.SpecializationRepository;
import com.iit.trainingcenter.repository.StudentRepository;
import com.iit.trainingcenter.repository.TrainerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final SpecializationRepository specializationRepository;
    private final TrainerRepository trainerRepository;

    public DataInitializer(StudentRepository studentRepository,
            SpecializationRepository specializationRepository,
            TrainerRepository trainerRepository) {
        this.studentRepository = studentRepository;
        this.specializationRepository = specializationRepository;
        this.trainerRepository = trainerRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Create Specializations if they don't exist
        if (specializationRepository.count() == 0) {
            Specialization s1 = new Specialization();
            s1.setName("Computer Science");
            s1.setDescription("Software development and AI");
            specializationRepository.save(s1);

            Specialization s2 = new Specialization();
            s2.setName("Network Engineering");
            s2.setDescription("Cloud and Cybersecurity");
            specializationRepository.save(s2);

            // 2. Create Sample Trainers
            Trainer t1 = new Trainer();
            t1.setFirstName("Mohamed");
            t1.setLastName("Zayani");
            t1.setEmail("zayani@iit.tn");
            t1.setPhone("99887766");
            t1.setHireDate(LocalDate.of(2015, 9, 1));
            t1.setBio("Expert in Spring Framework and Java Architecture.");
            t1.setSpecialization(s1);
            trainerRepository.save(t1);

            Trainer t2 = new Trainer();
            t2.setFirstName("Fatma");
            t2.setLastName("Ben Ali");
            t2.setEmail("fatma@iit.tn");
            t2.setPhone("55443322");
            t2.setHireDate(LocalDate.of(2018, 2, 15));
            t2.setBio("Specialist in Computer Networks and Cisco certifications.");
            t2.setSpecialization(s2);
            trainerRepository.save(t2);

            Trainer t3 = new Trainer();
            t3.setFirstName("Sami");
            t3.setLastName("Kallel");
            t3.setEmail("sami@iit.tn");
            t3.setPhone("22334455");
            t3.setHireDate(LocalDate.of(2020, 10, 10));
            t3.setBio("Enthusiastic developer focused on Web technologies and React.");
            t3.setSpecialization(s1);
            trainerRepository.save(t3);

            // 3. Create Sample Students
            Student st1 = new Student();
            st1.setFirstName("Ahmed");
            st1.setLastName("Zayani");
            st1.setEmail("ahmed@iit.tn");
            st1.setPhone("12345678");
            st1.setBirthDate(LocalDate.of(2002, 5, 20));
            st1.setEnrollmentDate(LocalDate.now());
            st1.setSpecialization(s1);
            studentRepository.save(st1);

            Student st2 = new Student();
            st2.setFirstName("Marwa");
            st2.setLastName("Makni");
            st2.setEmail("marwa@iit.tn");
            st2.setPhone("87654321");
            st2.setBirthDate(LocalDate.of(2003, 10, 12));
            st2.setEnrollmentDate(LocalDate.now());
            st2.setSpecialization(s2);
            studentRepository.save(st2);

            System.out.println("✅ Sample data (Specializations, Trainers, Students) initialized!");
        }
    }
}