package com.iit.trainingcenter;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ApiSmokeTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getAllStudentsReturnsJson() throws Exception {
        mockMvc.perform(get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    void getAllTrainersReturnsJson() throws Exception {
        mockMvc.perform(get("/api/trainers"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

        @Test
        void createTrainerAcceptsUpsertRequest() throws Exception {
                // specializationId=1 exists thanks to DataSeeder (Computer Science)
                String body = """
                                {
                                    \"firstName\": \"Test\",
                                    \"lastName\": \"Trainer\",
                                    \"email\": \"test.trainer@example.com\",
                                    \"phone\": \"99999999\",
                                    \"hireDate\": \"2025-01-01\",
                                    \"bio\": \"bio\",
                                    \"specializationId\": 1
                                }
                                """;

                mockMvc.perform(post("/api/trainers")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(body))
                                .andExpect(status().isOk())
                                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
        }

                    @Test
                    void getAllEnrollmentsReturnsJson() throws Exception {
                        mockMvc.perform(get("/api/enrollments"))
                                .andExpect(status().isOk())
                                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
                    }
}
