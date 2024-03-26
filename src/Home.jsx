import NavBar from "./NavBar";
import Slider from "react-slick";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { ArrowBackOutlined, ArrowForwardOutlined } from "@mui/icons-material";
import Select from "react-select";
import dayjs from "dayjs";
import { useRef } from "react";

const Home = () => {
  const { register, handleSubmit, reset, control } = useForm();
  const [hotelData, setHotelData] = useState();
  const [loader, setLoader] = useState(false);
  const [selectedOption, setSelectedOption] = useState("hotelsca");
  const [searchData, setSearchData] = useState("");
  const [pollingData, setPollingData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trendingCities, setTrendingCities] = useState({});
  const [selectedCrawling, setSelectedCrawling] = useState({
    value: "oldsearch",
    label: "Old Crawling",
  });
  const [hotelOptions, setHotelOptions] = useState([]);
  const hint = useRef("");

  console.log(hotelOptions, "hotelOptions");

  const getHotelsData = async (city, checkin, checkout, hotel) => {
    try {
      const url =
        selectedCrawling.value === "oldsearch"
          ? `http://localhost:8080/oldsearch/${city}`
          : `http://localhost:8080/newsearch/${city}/${checkin}/${checkout}`;

      const searchSelectUrl = `http://localhost:8080/select/${city}/${hotel}`;

      setLoader(true);
      const response = await axios.get(
        hotel?.length > 0 ? searchSelectUrl : url
      );
      setHotelData(response.data);
      reset();
      setLoader(false);
      if (response.data === null) {
        setError("No Options");
      }
    } catch (error) {
      reset();
      setLoader(false);
      console.error("Error fetching hotels data:", error);
    } finally {
      setLoader(false);
    }
  };

  const getTrendingCities = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/pg/`);

      setTrendingCities(response?.data ? response.data : {});
    } catch (err) {
      console.log(err);
    }
  };

  const getSearchData = async () => {
    if (searchData !== "") {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8080/find/${searchData}`
        );
        setPollingData(response.data);

        setError(null);
        setIsLoading(false);
        return response;
      } catch (error) {
        console.log("Error fetching search data: ", error);
      } finally {
        if (pollingData.length > 0) {
          let tempFilteredHotels = [];

          pollingData.forEach((item) => {
            if (item?.Hotels?.length) {
              item.Hotels.split(",").forEach((hotel) => {
                tempFilteredHotels.push({
                  label: hotel.trim(), // trim to remove any leading/trailing spaces
                  value: `hotel/${item.Cityname}`,
                });
              });
            }
          });

          console.log(tempFilteredHotels, "tempHotels");

          setHotelOptions(tempFilteredHotels);
        }
      }
    }
    setHotelOptions([]);
    setPollingData([]);
  };

  useEffect(() => {
    getSearchData();
    getTrendingCities();
    console.log(pollingData, "pol");
  }, [searchData]);

  const handleRegistration = (data) => {
    console.log(
      {
        ...data,
        checkin: dayjs(data.checkin).format("YYYY-MM-DD"),
        checkout: dayjs(data.checkout).format("YYYY-MM-DD"),
      },
      "searchData"
    );

    const checkin = dayjs(data.checkin).format("YYYY-MM-DD");
    const checkout = dayjs(data.checkout).format("YYYY-MM-DD");

    getHotelsData(data.city, checkin, checkout);
  };

  const handleWebsiteSelection = (option) => {
    setSelectedOption(option);
  };

  // react-slick settings
  const hotelListingsettings = {
    dots: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const CustomPrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <ArrowBackOutlined
        className={className}
        style={{
          ...style,
          display: "block",
          left: -40,
          top: 210,
          color: "#0877A2",
        }}
        onClick={onClick}
        fontSize="large"
      />
    );
  };

  const CustomNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <ArrowForwardOutlined
        className={className}
        style={{
          ...style,
          display: "block",
          right: -40,
          top: 210,
          color: "0877A2",
        }}
        onClick={onClick}
        fontSize="large"
      />
    );
  };

  const popularDestinationSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  const isLowerCase = (str) =>
    str.slice(str.length - 1, str.length) ===
    str.slice(str.length - 1, str.length).toLowerCase();

  console.log(hotelData, "hotelData");

  return (
    <div className="container-xxl bg-white p-0">
      {/* Navbar Start */}
      <NavBar />
      {/* Navbar End */}
      {/* Header Start */}
      <div className="container-fluid header bg-white p-0 m-0" id="slogan">
        <div className="row g-0 align-items-center flex-column-reverse flex-md-row">
          <h1 className="display-5 animated fadeIn mb-4 mt-5 text-white text-above-image line">
            <span className="text-primary">Comp</span>are Hotel Prices.<br></br>
            <span className="secondLine">
              Find Your <span className="text-primary">Perfect Stay.</span>
            </span>
          </h1>
          <img src="img/bg_slogan.png" alt="" />
          <div className="col-md-6 p-5 mt-lg-5"></div>
          <div className="col-md-6 animated fadeIn">
            <div className="owl-carousel header-carousel">
              <div className="owl-carousel-item">
                <img className="img-fluid" src="img/carousel-1.jpg" alt="" />
              </div>
              <div className="owl-carousel-item">
                <img className="img-fluid" src="img/carousel-2.jpg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container mb-5">
        <h2 class="text-center mb-5 display-5 text-primary">
          Popular Destinations
        </h2>
        {/* <div class="row"> */}
        <div
          className="row"
          style={{ paddingLeft: "50px", paddingRight: "50px" }}
        >
          <div className="popular-slick">
            <Slider {...popularDestinationSettings}>
              {trendingCities &&
                Object.keys(trendingCities).map((key, i) => (
                  <div
                    className="col-md-4 position-relative"
                    onClick={() => getHotelsData(key, "oldsearch")}
                    key={key}
                  >
                    <a href="#hello-hotels">
                      <img
                        src={trendingCities[key].split(" ")[1]}
                        style={{
                          height: "430px",
                          width: "400px",
                          border: "1px solid transparent",
                          borderRadius: "10px",
                        }}
                        alt={"Hotel " + (i + 1)}
                        className="img-fluid"
                      />
                      <div className="overlay-text lead display-6">
                        {key} - {trendingCities[key].split(" ")[0]}
                      </div>
                    </a>
                  </div>
                ))}
            </Slider>
          </div>
        </div>
      </div>
      <div
        className="container-fluid bg-primary mb-0 wow fadeIn"
        data-wow-delay="0.1s"
        style={{ padding: 35 }}
      >
        <div className="container">
          <form onSubmit={handleSubmit(handleRegistration)}>
            <div className="row g-2">
              <div className="col-md-10">
                <div className="row g-2">
                  <div className="col-lg-4 col-md-4">
                    <Autocomplete
                      onKeyDown={(event) => {
                        if (event.key === "Tab") {
                          if (hint.current) {
                            setSearchData(hint.current);
                            event.preventDefault();
                          }
                        }
                      }}
                      onBlur={() => {
                        hint.current = "";
                      }}
                      disablePortal
                      forcePopupIcon={false}
                      inputValue={searchData}
                      onChange={(e, v) => {
                        console.log(v, "v");
                        setSearchData(v?.label ?? "");
                        hint.current = "";
                        getHotelsData(
                          v?.value.split("/")[1],
                          null,
                          null,
                          v?.label
                        );
                      }}
                      getOptionLabel={(option) => option?.label}
                      filterOptions={(options, state) => {
                        const displayOptions = options.filter((option) =>
                          option.value
                            .toLowerCase()
                            .trim()
                            .includes(state.inputValue.toLowerCase().trim())
                        );
                        return displayOptions;
                      }}
                      id="combo-box-hint-demo"
                      options={hotelOptions}
                      sx={{ width: 300 }}
                      renderInput={(params) => {
                        return (
                          <Box
                            sx={{
                              position: "relative",
                              background: "white",
                            }}
                          >
                            <Typography
                              sx={{
                                position: "absolute",
                                opacity: 0.5,
                                left: 14,
                                top: 16,
                                color: "CaptionText",
                              }}
                            >
                              {hint.current}
                            </Typography>
                            <TextField
                              {...params}
                              {...register("city")}
                              placeholder="Search City"
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setSearchData(newValue);
                                const matchingOption = pollingData.find(
                                  (option) => {
                                    if (newValue.toLowerCase() === newValue) {
                                      return option.Cityname.toLowerCase().startsWith(
                                        newValue.toLowerCase()
                                      );
                                    } else {
                                      return option.Cityname.toUpperCase().startsWith(
                                        newValue.toUpperCase()
                                      );
                                    }
                                  }
                                );

                                if (newValue && matchingOption) {
                                  hint.current =
                                    newValue.toLowerCase() === newValue
                                      ? matchingOption.Cityname.toLowerCase()
                                      : matchingOption.Cityname.toUpperCase();
                                } else {
                                  hint.current = "";
                                }
                              }}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {isLoading && (
                                      <CircularProgress
                                        color="inherit"
                                        size={20}
                                      />
                                    )}
                                    {params.InputProps.endAdornment}
                                    {searchData !== "" &&
                                      pollingData.length > 0 && (
                                        <>
                                          <TrendingUpIcon
                                            style={{ color: "#0877A2" }}
                                            fontSize="small"
                                          />
                                          <span>
                                            {pollingData[0].Search_Freq}
                                          </span>
                                        </>
                                      )}
                                  </>
                                ),
                              }}
                            />
                          </Box>
                        );
                      }}
                    />
                  </div>
                  <div class="col-lg-3 col-md-4">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Controller
                        control={control}
                        name="checkin"
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            label="Check In"
                            sx={{
                              background: "white",
                              borderColor: "transparent",
                            }}
                            value={field.value ? field.value : null}
                            onChange={(newValue) => field.onChange(newValue)}
                            renderInput={(params) => (
                              <TextField {...params} placeholder="Check In" />
                            )}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </div>
                  <div class="col-lg-3 col-md-4">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Controller
                        control={control}
                        name="checkout"
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            label="Check Out"
                            sx={{
                              background: "white",
                              borderColor: "transparent",
                            }}
                            value={field.value ? field.value : null}
                            onChange={(newValue) => field.onChange(newValue)}
                            renderInput={(params) => (
                              <TextField {...params} placeholder="Check Out" />
                            )}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="col-lg-2 col-md-4">
                    <Select
                      {...register("crawling", {
                        value: selectedCrawling.value,
                      }).name}
                      defaultValue={selectedCrawling}
                      options={[
                        { value: "oldsearch", label: "Old Crawling" },
                        { value: "newsearch", label: "New Crawling" },
                      ]}
                      onChange={(value) => {
                        setSelectedCrawling(value);
                      }}
                      isSearchable={false}
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          border: "none",
                          borderRadius: "4px",
                          minHeight: "55px",
                        }),
                        indicatorSeparator: () => ({
                          display: "none",
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          color: "#666565",
                        }),
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-1 col-md-2">
                <button
                  className="button btn btn-dark border-0 w-100 py-3"
                  style={{ marginLeft: "40px" }}
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
        <div id="hello-hotels"></div>
      </div>
      {/* Search End */}

      {/* Property List Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-0 gx-5 align-items-end">
            <div className="col-lg-6">
              <div
                className="text-start mx-auto mb-5 wow slideInLeft"
                data-wow-delay="0.1s"
              >
                <h1 className="mb-3 text-primary">Hotel Listing</h1>
              </div>
            </div>
            <div
              className="col-lg-6 text-start text-lg-end wow slideInRight"
              data-wow-delay="0.1s"
            >
              <ul className="nav nav-pills d-inline-flex justify-content-end mb-5">
                <li className="nav-item me-2">
                  <a
                    className="btn btn-outline-primary active"
                    data-bs-toggle="pill"
                    href="#tab-1"
                    onClick={() => handleWebsiteSelection("hotelsca")}
                  >
                    Hotels.ca
                  </a>
                </li>
                <li className="nav-item me-2">
                  <a
                    className="btn btn-outline-primary"
                    data-bs-toggle="pill"
                    href="#tab-2"
                    onClick={() => handleWebsiteSelection("booking")}
                  >
                    Bookings.ca
                  </a>
                </li>
                <li className="nav-item me-0">
                  <a
                    className="btn btn-outline-primary"
                    data-bs-toggle="pill"
                    href="#tab-3"
                    onClick={() => handleWebsiteSelection("mmt")}
                  >
                    MakeMyTrip.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="tab-content">
            <div id="tab-1" className="tab-pane fade show p-0 active">
              <div className="row g-4">
                {loader ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <img
                      width={"50px"}
                      style={{ marginBottom: "100px", marginTop: "100px" }}
                      src="Spinner.gif"
                      alt="spinner gif"
                    />
                  </div>
                ) : hotelData ? (
                  (hotelData[selectedOption] ?? [...hotelData].reverse()).map(
                    (item) => (
                      <div
                        className="col-lg-4 col-md-6 wow fadeInUp"
                        data-wow-delay="0.1s"
                      >
                        <div className="property-item">
                          <div className="">
                            <Slider {...hotelListingsettings}>
                              {item?.["Images "]
                                ?.trim()
                                .split(" ")
                                .map((photo) => (
                                  <div>
                                    <img
                                      className="img-fluid"
                                      style={{
                                        width: "450px",
                                        height: "300px",
                                      }}
                                      src={photo}
                                      alt=""
                                    />
                                  </div>
                                ))}
                              {/* <div>
                                <img
                                  className="img-fluid"
                                  style={{ width: "450px", height: "300px" }}
                                  src={item?.["Images "]?.split(" ")[1]}
                                  alt=""
                                />
                              </div>
                              <div>
                                <img
                                  className="img-fluid"
                                  style={{ width: "450px", height: "300px" }}
                                  src={item?.["Images "]?.split(" ")[2]}
                                  alt=""
                                />
                              </div> */}
                            </Slider>
                          </div>
                          <div className="p-4 pb-0">
                            {item?.["Distance "]?.length > 0 && (
                              <h6 className="text-primary mb-3">
                                {Number(item?.["Distance "]).toFixed(2)} Km away
                              </h6>
                            )}
                            <h5 className="text-primary mb-3">
                              {item?.["MinPrice "] === "Not Available "
                                ? "Price not available"
                                : item?.["MinPrice "].split(" ")[0] === "CAD"
                                ? `$ ${Math.min(
                                    item?.["MinPrice "].split(" ")[1]
                                  )}`
                                : `$ ${Math.min(
                                    item?.["MinPrice "].split(" ")[0]
                                  )}`}
                            </h5>
                            <a className="d-block h5 mb-2" href="">
                              {item?.["Name "]}
                            </a>
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                paddingBottom: "10px",
                              }}
                            >
                              {/* <i className="fa fa-map-marker-alt text-primary me-2" /> */}
                              <img
                                width={"15px"}
                                src="rating.svg"
                                alt="ratings"
                              />
                              <span>{item?.["Review "].split(" ")[0]}</span>
                            </div>
                            {/* <p></p> */}
                          </div>
                          {/* <div className="d-flex border-top"></div> */}
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <img
                      style={{ width: "400px" }}
                      src="no-data-preview.svg"
                      alt="no-data-img"
                    />
                    <h4>No data available!</h4>
                    <h4>
                      Please use the search bar to find and compare hotel
                      prices.
                    </h4>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* about us container */}
      <div class="container-xxl py-5">
        <div class="container text-center py-3">
          <h1 class="display-5 text-primary">About Us</h1>
        </div>

        <div class="container py-5">
          <div class="row align-items-center">
            {/* <!-- Left Column for Picture --> */}
            <div class="col-md-6 image-column">
              <img
                src="img/aboutUs.png"
                class="img-fluid"
                alt="About Us Image"
              ></img>
            </div>
            {/* <!-- Right Column for Text --> */}
            <div class="col-md-6">
              <h2 class="display-6 text-secondary">
                Why<br></br>Choosing Us
              </h2>
              <br />
              <p class="fs-5 text-dark">
                We are not just a hotel booking platform; we're your trusted
                companion in unlocking the best stay experiences. At HotelHawk,
                our core commitment is to redefine your travel planning by
                providing unparalleled hotel price analysis. Our platform
                empowers you to effortlessly explore a wide range of hotel
                options, carefully analyzing prices, ratings, and essential
                details for your specified location. We take pride in our
                precision-driven approach, ensuring that you make informed
                decisions that align with your preferences and budget. With
                HotelHawk, your journey begins with a seamless, user-friendly
                interface, guiding you through a world of accommodation
                possibilities. Elevate your travel experience, embrace
                convenience, and choose HotelHawk for a smarter, more satisfying
                way to discover and book your ideal stay.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xxl py-5">
        <div className="container">
          <div
            className="text-center mx-auto mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: 600 }}
          >
            <h1 className="mb-3 text-primary">Our Team Members</h1>
          </div>
          <div className="container team-members-container row g-5">
            <div
              className="col-lg-2 col-md-4 col-sm-6 wow fadeInUp team-item"
              data-wow-delay="0.1s"
            >
              <div className="team-item rounded overflow-hidden">
                <div className="position-relative">
                  <img className="img-fluid" src="img/team-1.jpg" alt="" />
                </div>
                <div className="text-center p-4 mt-3">
                  <h5 className="fw-bold mb-0 text-primary">Full Name</h5>
                </div>
              </div>
            </div>
            <div
              className="col-lg-2 col-md-4 col-sm-6 wow fadeInUp team-item"
              data-wow-delay="0.3s"
            >
              <div className="team-item rounded overflow-hidden">
                <div className="position-relative">
                  <img className="img-fluid" src="img/team-2.jpg" alt="" />
                </div>
                <div className="text-center p-4 mt-3">
                  <h5 className="fw-bold mb-0 text-primary">Full Name</h5>
                </div>
              </div>
            </div>
            <div
              className="col-lg-2 col-md-4 col-sm-6 wow fadeInUp team-item"
              data-wow-delay="0.5s"
            >
              <div className="team-item rounded overflow-hidden">
                <div className="position-relative">
                  <img className="img-fluid" src="img/team-3.jpg" alt="" />
                </div>
                <div className="text-center p-4 mt-3">
                  <h5 className="fw-bold mb-0 text-primary">Full Name</h5>
                </div>
              </div>
            </div>
            <div
              className="col-lg-2 col-md-4 col-sm-6 wow fadeInUp team-item"
              data-wow-delay="0.7s"
            >
              <div className="team-item rounded overflow-hidden">
                <div className="position-relative">
                  <img className="img-fluid" src="img/team-4.jpg" alt="" />
                </div>
                <div className="text-center p-4 mt-3">
                  <h5 className="fw-bold mb-0 text-primary">Full Name</h5>
                </div>
              </div>
            </div>
            <div
              className="col-lg-2 col-md-4 col-sm-6 wow fadeInUp team-item"
              data-wow-delay="0.9s"
            >
              <div className="team-item rounded overflow-hidden">
                <div className="position-relative">
                  <img className="img-fluid" src="img/team-4.jpg" alt="" />
                </div>
                <div className="text-center p-4 mt-3">
                  <h5 className="fw-bold mb-0 text-primary">Full Name</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="container-fluid bg-dark text-white-50 footer pt-5 mt-5 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div className="container py-5"></div>
        <div className="container">
          <p className="text-align-left text-white pb-2 pl-2">
            Copyright © 2024 HotelHawk.com™. All rights reserved.
          </p>
        </div>
      </div>

      <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top">
        <i className="bi bi-arrow-up" />
      </a>
    </div>
  );
};

export default Home;
