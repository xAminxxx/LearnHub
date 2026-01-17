package com.iit.trainingcenter.util;

import com.iit.trainingcenter.entity.*;
import com.iit.trainingcenter.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SpecializationRepository specializationRepository;
    private final TrainerRepository trainerRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, SpecializationRepository specializationRepository, TrainerRepository trainerRepository, StudentRepository studentRepository, CourseRepository courseRepository, EnrollmentRepository enrollmentRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.specializationRepository = specializationRepository;
        this.trainerRepository = trainerRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedSpecializations();
        seedTrainers();
        seedStudents();
        seedCourses();
        seedEnrollments();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            userRepository.saveAll(Arrays.asList(
                    new User(null, "admin", passwordEncoder.encode("password"), "admin@example.com", Role.ADMIN, true),
                    new User(null, "trainer", passwordEncoder.encode("password"), "trainer@example.com", Role.TRAINER, true),
                    new User(null, "student", passwordEncoder.encode("password"), "student@example.com", Role.STUDENT, true)
            ));
        }
    }

    private void seedSpecializations() {
        // Seed by identity (name). Important: avoid passing null collections to the all-args constructor,
        // otherwise it overwrites the default empty lists and can cause NPEs later.
        if (specializationRepository.findByName("Computer Science") == null) {
            Specialization cs = new Specialization();
            cs.setName("Computer Science");
            cs.setDescription("Computer Science description");
            specializationRepository.save(cs);
        }
        if (specializationRepository.findByName("Business") == null) {
            Specialization business = new Specialization();
            business.setName("Business");
            business.setDescription("Business description");
            specializationRepository.save(business);
        }
    }

    private void seedTrainers() {
        // Seed by identity (email) so this stays safe even if some data already exists.
        Specialization cs = specializationRepository.findByName("Computer Science");
        Specialization business = specializationRepository.findByName("Business");

        if (cs == null || business == null) {
            seedSpecializations();
            cs = specializationRepository.findByName("Computer Science");
            business = specializationRepository.findByName("Business");
        }

        if (trainerRepository.findByEmail("john.doe@example.com") == null) {
            Trainer john = new Trainer();
            john.setFirstName("John");
            john.setLastName("Doe");
            john.setEmail("john.doe@example.com");
            john.setPhone("11111111");
            john.setHireDate(LocalDate.now());
            john.setBio("Bio for John Doe");
            john.setSpecialization(cs);
            trainerRepository.save(john);
        }
        if (trainerRepository.findByEmail("jane.doe@example.com") == null) {
            Trainer jane = new Trainer();
            jane.setFirstName("Jane");
            jane.setLastName("Doe");
            jane.setEmail("jane.doe@example.com");
            jane.setPhone("22222222");
            jane.setHireDate(LocalDate.now());
            jane.setBio("Bio for Jane Doe");
            jane.setSpecialization(business);
            trainerRepository.save(jane);
        }
    }

    private void seedStudents() {
        // Seed by identity (email) to avoid failures on partially populated databases.
        Specialization cs = specializationRepository.findByName("Computer Science");
        Specialization business = specializationRepository.findByName("Business");

        if (cs == null || business == null) {
            seedSpecializations();
            cs = specializationRepository.findByName("Computer Science");
            business = specializationRepository.findByName("Business");
        }

        if (studentRepository.findByEmail("alice.smith@example.com") == null) {
            Student alice = new Student();
            alice.setFirstName("Alice");
            alice.setLastName("Smith");
            alice.setEmail("alice.smith@example.com");
            alice.setPhone("33333333");
            alice.setBirthDate(LocalDate.now().minusYears(20));
            alice.setEnrollmentDate(LocalDate.now());
            alice.setSpecialization(cs);
            studentRepository.save(alice);
        }

        if (studentRepository.findByEmail("bob.johnson@example.com") == null) {
            Student bob = new Student();
            bob.setFirstName("Bob");
            bob.setLastName("Johnson");
            bob.setEmail("bob.johnson@example.com");
            bob.setPhone("44444444");
            bob.setBirthDate(LocalDate.now().minusYears(22));
            bob.setEnrollmentDate(LocalDate.now());
            bob.setSpecialization(business);
            studentRepository.save(bob);
        }
    }

    private void seedCourses() {
        // Courses require a NOT NULL trainer_id. Don't rely on count() checks only; ensure trainer exists.
        Trainer john = trainerRepository.findByEmail("john.doe@example.com");
        Trainer jane = trainerRepository.findByEmail("jane.doe@example.com");

        // In case seedTrainers() didn't run (or DB is partially populated), self-heal here.
        if (john == null || jane == null) {
            seedTrainers();
            john = trainerRepository.findByEmail("john.doe@example.com");
            jane = trainerRepository.findByEmail("jane.doe@example.com");
        }

        Specialization cs = specializationRepository.findByName("Computer Science");
        Specialization business = specializationRepository.findByName("Business");

        if (cs == null || business == null) {
            seedSpecializations();
            cs = specializationRepository.findByName("Computer Science");
            business = specializationRepository.findByName("Business");
        }

        if (courseRepository.findByCode("CS101") == null) {
            Course cs101 = new Course();
            cs101.setCode("CS101");
            cs101.setName("Intro to CS");
            cs101.setDescription("Intro to CS description");
            cs101.setCredit(3);
            cs101.setMaxStudents(30);
            cs101.setTrainer(john);
            cs101.setSpecialization(cs);
            courseRepository.save(cs101);
        }
        if (courseRepository.findByCode("BUS101") == null) {
            Course bus101 = new Course();
            bus101.setCode("BUS101");
            bus101.setName("Intro to Business");
            bus101.setDescription("Intro to Business description");
            bus101.setCredit(3);
            bus101.setMaxStudents(30);
            bus101.setTrainer(jane);
            bus101.setSpecialization(business);
            courseRepository.save(bus101);
        }
    }

    private void seedEnrollments() {
        // Keep this safe even if the DB is only partially seeded.
        Student alice = studentRepository.findByEmail("alice.smith@example.com");
        Student bob = studentRepository.findByEmail("bob.johnson@example.com");
        Course cs101 = courseRepository.findByCode("CS101");
        Course bus101 = courseRepository.findByCode("BUS101");

        if (alice == null || bob == null) {
            seedStudents();
            alice = studentRepository.findByEmail("alice.smith@example.com");
            bob = studentRepository.findByEmail("bob.johnson@example.com");
        }
        if (cs101 == null || bus101 == null) {
            seedCourses();
            cs101 = courseRepository.findByCode("CS101");
            bus101 = courseRepository.findByCode("BUS101");
        }

        // If still missing for any reason, don't crash the whole app during bootstrap.
        if (alice == null || bob == null || cs101 == null || bus101 == null) {
            return;
        }

        // Enrollment.enrollmentDate is nullable=false; don't pass null.
        if (enrollmentRepository.count() == 0) {
            Enrollment e1 = new Enrollment();
            e1.setStudent(alice);
            e1.setCourse(cs101);
            e1.setStatus(EnrollmentStatus.ACTIVE);

            Enrollment e2 = new Enrollment();
            e2.setStudent(bob);
            e2.setCourse(bus101);
            e2.setStatus(EnrollmentStatus.ACTIVE);

            enrollmentRepository.saveAll(Arrays.asList(e1, e2));
        }
    }
}
