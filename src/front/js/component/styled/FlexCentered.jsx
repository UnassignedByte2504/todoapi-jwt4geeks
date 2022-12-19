const { styled } =require("@mui/system")
const { Box } =require("@mui/material")

const FlexCentered= styled(Box)(
    {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
)

export default FlexCentered