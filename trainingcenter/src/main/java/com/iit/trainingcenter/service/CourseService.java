package com.iit.trainingcenter.service;

import com.iit.trainingcenter.entity.Course;
import com.iit.trainingcenter.repository.CourseRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id).orElse(null);
    }

    public List<Course> getCoursesBySpecialization(Long specializationId) {
        return courseRepository.findBySpecializationId(specializationId);
    }

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, Course courseDetails) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + id));

        course.setCode(courseDetails.getCode());
        course.setName(courseDetails.getName());
        course.setDescription(courseDetails.getDescription());
        course.setCredit(courseDetails.getCredit());
        course.setMaxStudents(courseDetails.getMaxStudents());
        course.setTrainer(courseDetails.getTrainer());
        course.setSpecialization(courseDetails.getSpecialization());

        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }
}
