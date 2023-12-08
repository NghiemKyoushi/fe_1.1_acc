/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import React from "react";
//@ts-ignore
import { Box, Paper, Typography } from "@mui/material";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";

export interface ImageUploadProps {
  handleGetFile: (file: any) => void;
  filePath: string;
}
export default function ImageUpload(props: ImageUploadProps) {
  const { handleGetFile, filePath } = props;
  const [state, setstate] = useState(filePath);
  var loadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    if (event.target.files[0]) {
      setstate(URL?.createObjectURL(event.target.files[0]));
      const files = Array.from(event.target.files);
      handleGetFile(files);
    }
  };
  useEffect(() => {
    setstate(filePath);
  }, [filePath]);
  return (
    <Paper style={{ width: "200px" }}>
      <Box
        width="200px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <input
          type="file"
          accept="image/*"
          name="image"
          id="file"
          onChange={loadFile}
          style={{ display: "none" }}
        />
        <Typography variant="subtitle2">Ảnh dẫn chứng</Typography>

        <img
          src={
            state
              ? state
              : "https://cdn3.iconfinder.com/data/icons/it-and-ui-mixed-filled-outlines/48/default_image-1024.png"
          }
          id="output"
          width="150"
          alt="test"
        />
      </Box>
      <Box display="flex" justifyContent="flex-end" padding="10px 20px">
        <label htmlFor="file" style={{ cursor: "pointer" }}>
          <DriveFolderUploadOutlinedIcon />
        </label>
      </Box>
    </Paper>
  );
}
