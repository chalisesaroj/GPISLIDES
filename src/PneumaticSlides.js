import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Container,
  Fab,
  IconButton,
} from "@mui/material";
import { ArrowBack, ArrowForward, Home, VideoFile } from "@mui/icons-material";

export default function PneumaticSlides() {
  const slides = [
    { id: "title", title: "3.6 - 3.9 Pneumatics", lines: ["Working principle of After Coolers, Dryers, Receivers, and Filters"] },
    { id: "3.6-1", title: "3.6 After Coolers", lines: ["Remove heat from compressed air", "Improve efficiency of dryers & filters"], hasVideo:true },
    { id: "3.7-1", title: "3.7 Dryers", lines: ["Remove/reduce moisture content"], hasVideo:true },
    { id: "3.8-1", title: "3.8 Receiver", lines: ["Acts as buffer and storage tank"], hasVideo:true },
    { id: "3.9-1", title: "3.9 Filters", lines: ["Protect downstream equipment from contaminants"], hasVideo:true },
    // add other slides similarly...
  ];

  const total = slides.length;
  const [index, setIndex] = useState(0);
  const [videos, setVideos] = useState({});

  const fileRefs = useRef({});

  const next = () => setIndex(i => (i + 1 < total ? i + 1 : i));
  const prev = () => setIndex(i => (i - 1 >= 0 ? i - 1 : i));
  const goTo = (i) => setIndex(Math.max(0, Math.min(total - 1, i)));

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Home") goTo(0);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleVideoUpload = (slideId, file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setVideos(v => ({ ...v, [slideId]: { url, name: file.name } }));
  };

  return (
    <Container maxWidth="xl" sx={{ height: "100vh", display: "flex", py: 2 }}>
      {/* Slide Area */}
      <Box sx={{ flex: 1, position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {slides.map((s, i) => (
          <Paper
            key={s.id}
            elevation={6}
            sx={{
              position: "absolute",
              width: "80%",
              p: 4,
              transition: "all 0.5s ease",
              transform: `translateX(${(i - index) * 100}%)`,
              background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
              color: "#fff",
              borderRadius: 3,
              minHeight: "60%",
            }}
          >
            <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
              {s.title}
            </Typography>
            {s.lines.map((line, idx) => (
              <Typography key={idx} variant="h6" sx={{ mb: 1 }}>
                • {line}
              </Typography>
            ))}

            {s.hasVideo && (
              <Box mt={3}>
                {videos[s.id] ? (
                  <video controls style={{ width: "100%", borderRadius: 8 }}>
                    <source src={videos[s.id].url} type="video/mp4" />
                  </video>
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: 200,
                      border: "2px dashed #fff",
                      borderRadius: 2,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontStyle: "italic",
                    }}
                  >
                    No video uploaded
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        ))}

        {/* Navigation Buttons */}
        <Fab color="secondary" sx={{ position: "absolute", left: 16, top: "50%" }} onClick={prev}>
          <ArrowBack />
        </Fab>
        <Fab color="secondary" sx={{ position: "absolute", right: 16, top: "50%" }} onClick={next}>
          <ArrowForward />
        </Fab>
      </Box>

      {/* Right Panel */}
      <Box sx={{ width: 360, ml: 2, overflowY: "auto" }}>
        <Typography variant="h6" gutterBottom>Video Uploads</Typography>
        {slides.map((s) => s.hasVideo && (
          <Paper key={s.id} sx={{ p: 1, mb: 2 }}>
            <Grid container alignItems="center" spacing={1}>
              <Grid item xs={8}>
                <Typography variant="body2">{s.title}</Typography>
              </Grid>
              <Grid item xs={4}>
                <input
                  ref={el => fileRefs.current[s.id] = el}
                  type="file"
                  accept="video/*"
                  onChange={e => handleVideoUpload(s.id, e.target.files[0])}
                />
              </Grid>
              {videos[s.id] && (
                <Grid item xs={12}>
                  <Typography variant="caption">{videos[s.id].name}</Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        ))}
      </Box>
    </Container>
  );
}
