import satori from "satori";
import fs from "node:fs/promises";
import { toReadableString } from "src/utils";
import sharp from "sharp";

// Design inspiration from Jacob Kaplan-Moss: https://jacobian.org

const accentColor = "#0fa817";
const backgroundColor = "rgba(27, 31, 35, 0.10)";

type ImageProps = {
  title: string;
  subtitle: string | null;
  date: Date;
  path: string;
  tags?: string[];
};

const OGImage = ({ title, subtitle, date, path, tags = [] }: ImageProps) => (
  <div
    style={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fff",
      color: "#111",
      fontSize: 32,
      fontWeight: 400,
      background: `linear-gradient(135deg, ${accentColor}, rgba(15, 168, 23, 0.206))`,
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: `5px solid #111`,
        borderRadius: "15px",
        alignContent: "center",
        justifyContent: "space-between",
        justifyItems: "center",
        width: 1000,
        height: 500,
        background: "white",
        boxShadow: `5px 5px 10px #111`,
      }}
    >
      <div
        style={{
          color: "black",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          flex: 1,
          marginLeft: 30,
        }}
      >
        &gt; ~/{path}
        <span
          style={{
            display: "block",
            width: 15,
            height: 28,
            marginLeft: 5,
            background: accentColor,
            opacity: 0.65,
          }}
        ></span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          marginLeft: 50,
          color: "#111",
          justifyContent: "space-around",
        }}
      >
        <span style={{ fontSize: 64, fontWeight: 600 }}>{title}</span>
      </div>
      <div style={{ flex: 1 }}></div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          width: "100%",
          justifyContent: "flex-start",
          marginLeft: 50,
        }}
      >
        Davis Haupt // {toReadableString(date)}
        {tags.length > 0 ? (
          <div
            style={{
              display: "flex",
              fontWeight: 400,
              flex: 0.5,
            }}
          >
            {tags.slice(0, 3).map((tag) => (
              <span
                style={{
                  backgroundColor: backgroundColor,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px 10px",
                  height: 24,
                  fontSize: 24,
                  borderRadius: 5,
                  marginRight: 10,
                  marginBlockStart: 0,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  </div>
);

export const makeOpenGraphImage = async (props: ImageProps) =>
  await satori(<OGImage {...props}></OGImage>, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Inter",
        data: await fs.readFile("./public/fonts/inter-latin-400-normal.ttf"),
        weight: 400,
        style: "normal",
      },
      {
        name: "Inter",
        data: await fs.readFile("./public/fonts/inter-latin-600-normal.ttf"),
        weight: 600,
        style: "normal",
      },
    ],
  });

export const previewImage = async (props: ImageProps) => {
  const svg = await makeOpenGraphImage(props);
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
