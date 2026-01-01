package com.iit.trainingcenter.restcontroller;

import com.iit.trainingcenter.dto.CourseDto;
import com.iit.trainingcenter.dto.DtoMapper;
import com.iit.trainingcenter.entity.Course;
import com.iit.trainingcenter.service.CourseService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/courses")
public class CourseRestController {

    private final CourseService courseService;

    @GetMapping
    public List<CourseDto> getAllCourses() {
        return courseService.getAllCourses().stream().map(DtoMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public CourseDto getCourseById(@PathVariable Long id) {
        return DtoMapper.toDto(courseService.getCourseById(id));
    }

    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        return courseService.createCourse(course);
    }

    @PutMapping("/{id}")
    public Course updateCourse(@PathVariable Long id, @RequestBody Course courseDetails) {
        return courseService.updateCourse(id, courseDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
    }
}
