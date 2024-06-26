import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { Box, Container, Typography, Grow } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import usePurcahse from "../../hooks/usePurchase";
import OrderUpdatePopup from "../../components/Sales/OrderUpdatePopup";
import MessagePop from "../../components/Sales/MessagePop";
import purchaseService from "../../services/Sales/purchaseService";
import useCart from "../../hooks/useCarts";
import useGameQueryStore from "../../store";
import { useNavigate } from "react-router-dom";
import addCartService from "../../services/Sales/addCartService";

const OrderPage = () => {
  const { getCurrentUser } = useAuth();

  const { data, isLoading, refetch } = useCart(getCurrentUser()._id);

  const SetSelectedQuantity = useGameQueryStore((s) => s.SetSelectedQuantity);

  const SetSelectedProduct = useGameQueryStore((s) => s.SetSelectedProduct);

  const [open, openchange] = React.useState(false);

  const [opennotify, setOpennotify] = React.useState(false);

  const [selectedId, setSelecetId] = React.useState(null);

  const navigate = useNavigate();

  const handleProceed = (cart) => {
    const data = { quantity: cart.quantity };

    SetSelectedQuantity(data);

    SetSelectedProduct(cart.product);

    navigate("/checkout");
  };

  const handleDelete = (cartId) => {
    console.log("submited");
    setSelecetId(cartId);
    setOpennotify(true);
  };

  const handleDeleteConfirm = () => {
    addCartService
      .delete(selectedId)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Container sx={{ margin: "150px", alignItems: "center" }}>
        {data?.map((cart) => (
          <React.Fragment key={cart._id}>
            <Grow
              in={true}
              style={{ transformOrigin: "0 0 0" }}
              {...(true ? { timeout: 700 } : {})}
            >
              <Accordion
                sx={{
                  marginTop: "20px",
                  borderRadius: "16px",
                  backgroundColor: "#E2F4C5",
                }}
                defaultExpanded
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <AccordionSummary
                    aria-controls="panel3-content"
                    id="panel3-header"
                    sx={{ fontSize: "23px", fontWeight: "100px" }}
                  >
                    {" "}
                    {cart.product.name}{" "}
                  </AccordionSummary>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                  <Typography sx={{ fontSize: "20px", marginLeft: "16px" }}>
                    Total : {cart.product.price * cart.quantity * 20}
                  </Typography>
                  <Typography sx={{ fontSize: "20px", marginLeft: "60px" }}>
                    Category : {cart.product.category}
                  </Typography>
                  <Typography sx={{ fontSize: "20px", marginLeft: "60px" }}>
                    Quantity : {cart.quantity} packs
                  </Typography>
                  <Typography sx={{ fontSize: "20px", marginLeft: "60px" }}>
                    Order Date : {cart.orderDate.substring(0, 10)}
                  </Typography>
                </Box>

                <AccordionDetails>{cart.product.description}</AccordionDetails>
                <AccordionActions>
                  <Button
                    variant="contained"
                    sx={{
                      background: "rgba(155, 207, 83, 0.8)",
                      borderRadius: "10px",
                      margin: "10px",
                      color: "black",
                    }}
                    onClick={() => handleProceed(cart)}
                  >
                    Proceed
                  </Button>

                  <Button
                    onClick={() => handleDelete(cart._id)}
                    variant="contained"
                    sx={{
                      background: "#DF2E38",
                      borderRadius: "10px",
                      color: "white",
                      margin: "10px",
                    }}
                  >
                    Cancell
                  </Button>
                </AccordionActions>
              </Accordion>
            </Grow>
          </React.Fragment>
        ))}
      </Container>

      <MessagePop
        opennotify={opennotify}
        setOpennotify={setOpennotify}
        refetch={refetch}
        handlefunction={handleDeleteConfirm}
      />
    </>
  );
};

export default OrderPage;
