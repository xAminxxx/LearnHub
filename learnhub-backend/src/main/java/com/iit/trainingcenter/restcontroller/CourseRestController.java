package com.iit.trainingcenter.restcontroller;

import com.iit.trainingcenter.dto.CourseDto;
import com.iit.trainingcenter.dto.DtoMapper;
import com.iit.trainingcenter.dto.request.CourseRequest;
import com.iit.trainingcenter.entity.Course;
import com.iit.trainingcenter.service.CourseService;
import com.iit.trainingcenter.service.SpecializationService;
import com.iit.trainingcenter.service.TrainerService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/courses")
public class CourseRestController {

    private final CourseService courseService;
    private final TrainerService trainerService;
    private final SpecializationService specializationService;

    @GetMapping
    public List<CourseDto> getAllCourses() {
        return courseService.getAllCourses().stream().map(DtoMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public CourseDto getCourseById(@PathVariable Long id) {
        return DtoMapper.toDto(courseService.getCourseById(id));
    }

    @PostMapping
    public CourseDto createCourse(@RequestBody CourseRequest request) {
        Course course = new Course();
        course.setCode(request.code());
        course.setName(request.title());
        course.setDescription(request.description());
        course.setCredit(request.credit());
        course.setMaxStudents(request.maxStudents());
        if (request.trainerId() != null) {
            course.setTrainer(trainerService.getTrainerById(request.trainerId()));
        }
        if (request.specializationId() != null) {
            course.setSpecialization(specializationService.getSpecializationById(request.specializationId()));
        }
        return DtoMapper.toDto(courseService.createCourse(course));
    }

    @PutMapping("/{id}")
    public CourseDto updateCourse(@PathVariable Long id, @RequestBody CourseRequest request) {
        Course details = new Course();
        details.setCode(request.code());
        details.setName(request.title());
        details.setDescription(request.description());
        details.setCredit(request.credit());
        details.setMaxStudents(request.maxStudents());
        if (request.trainerId() != null) {
            details.setTrainer(trainerService.getTrainerById(request.trainerId()));
        }
        if (request.specializationId() != null) {
            details.setSpecialization(specializationService.getSpecializationById(request.specializationId()));
        }
        return DtoMapper.toDto(courseService.updateCourse(id, details));
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
    }
}
