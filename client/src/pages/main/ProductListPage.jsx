import PropTypes from 'prop-types';
// icons
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import { LoadingButton, Pagination } from '@material-ui/lab';
// hooks
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useQuery from '../../hooks/useQuery';
import useLocales from '../../hooks/useLocales';
// components
import Page from '../../components/Page';
import { ProductList } from '../../components/e-commerce';
import {
  initialSearch,
  searchProduct,
  setSelectedCategories,
  setSelectedBrands
} from '../../redux/slices/searchProductSlice';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(10),
  backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 100 : 800]
}));

// ----------------------------------------------------------------------
const SORTBY = [
  {
    name: 'Mặc định',
    value: 'default'
  },
  {
    name: 'Giá giảm giần',
    value: 'variants.price-desc'
  },
  {
    name: 'Giá tăng dần',
    value: 'variants.price-asc'
  },
  {
    name: 'A - Z',
    value: 'name-asc'
  },
  {
    name: 'Z - A',
    value: 'name-desc'
  }
];

const PRICE = [
  {
    name: 'Mặc định',
    value: '0'
  },
  {
    name: 'Dưới 3 triệu',
    value: '0-3000000'
  },
  {
    name: '3 - 7 tr',
    value: '3000000-7000000'
  },
  {
    name: 'Trên 7 triệu',
    value: '7000000-'
  }
];
ProductListPage.propTypes = {
  sortbyOptions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string
    })
  )
};
ProductListPage.defaultProps = {
  sortbyOptions: SORTBY
};
export default function ProductListPage() {
  const query = useQuery();
  const { t } = useLocales();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const brandSlug = query.get('b');
  const categorySlug = query.get('c');
  const search = query.get('search');

  const {
    isInitialized,
    categoryOpts,
    brandOpts,
    selectedCategories,
    selectedBrands,
    list: productsApi,
    isLoading: isLoadingProduct,
    pagination
  } = useSelector((state) => state.searchProduct);

  const [searchText, setSearchText] = useState(decodeURIComponent(search || ''));

  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [sortPrice, setSortPrice] = useState('0');
  const [page, setPage] = useState(1);
  const limit = 10;
  useEffect(() => {
    dispatch(initialSearch());
  }, [dispatch]);
  useEffect(() => {
    setSearchText(decodeURIComponent(search || ''));

    const cs = [...categoryOpts.filter((x) => categorySlug?.split(',').includes(x.slug))];
    dispatch(setSelectedCategories(cs));
    const bs = [...brandOpts.filter((x) => brandSlug?.split(',').includes(x.slug))];
    dispatch(setSelectedBrands(bs));

    const b = selectedBrands.map((x) => x._id).join(',');
    const c = selectedCategories.map((x) => x._id).join(',');

    const sb = sortBy === 'default' ? 'default' : sortBy.split('-')[0];
    const s = sortBy === 'default' ? 'asc' : sortBy.split('-')[1];

    dispatch(searchProduct({ search: searchText, category: c, brand: b, page, limit, sort: s, sortBy: sb }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isInitialized, categorySlug, brandSlug, search, page]);

  useEffect(() => {
    if (page === 1) {
      setProducts([...productsApi]);
    } else {
      setProducts((prev) => [...prev, ...productsApi]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsApi]);
  const handleLoadMore = () => {
    setPage((page) => page + 1);
  };
  // const handleChange = (e, p) => {
  //   console.log('p: ', p);
  //   setPage(p);
  // };
  const handleSearchTextKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleCategoriesChange = (_e, value) => {
    dispatch(setSelectedCategories(value));
  };

  const handleBrandsChange = (_e, value) => {
    dispatch(setSelectedBrands(value));
  };

  const handleSearch = () => {
    setProducts((_prev) => []);
    const bQuery = selectedBrands.map((x) => x.slug).join(',');
    const cQuery = selectedCategories.map((x) => x.slug).join(',');
    const sb = sortBy === 'default' ? 'default' : sortBy.split('-')[0];
    const s = sortBy === 'default' ? 'asc' : sortBy.split('-')[1];
    const minPrice = sortPrice === 'default' ? 0 : sortPrice.split('-')[0];
    const maxPrice = sortPrice.split('-')[1];
    setPage(1);
    dispatch(searchProduct({ search: searchText, page, limit, sort: s, sortBy: sb, minPrice, maxPrice }));
    navigate(`/q?c=${cQuery}&b=${bQuery}&search=${encodeURIComponent(searchText)}`);
  };
  const handleChangeSort = (event) => {
    const {
      target: { value }
    } = event;
    setSortBy(value);
  };
  const handleChangeSortPrice = (event) => {
    const {
      target: { value }
    } = event;
    setSortPrice(value);
  };
  return (
    <Page title={t('home.page-title')} id="move_top">
      <ContentStyle>
        <Container maxWidth="lg">
          <Stack spacing={10}>
            <Box>
              <Card sx={{ marginBottom: 4, padding: 4 }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h5" component="h2" color="text.secondary" gutterBottom>
                      {t('products.heading').toUpperCase()}
                    </Typography>
                    <Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Autocomplete
                            multiple
                            fullWidth
                            options={categoryOpts}
                            getOptionLabel={(item) => item.name}
                            value={selectedCategories}
                            filterSelectedOptions
                            renderInput={(params) => <TextField {...params} label={t('dashboard.categories.title')} />}
                            onChange={handleCategoriesChange}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Autocomplete
                            multiple
                            fullWidth
                            options={brandOpts}
                            getOptionLabel={(item) => item?.name}
                            value={selectedBrands}
                            filterSelectedOptions
                            renderInput={(params) => <TextField {...params} label={t('dashboard.brands.title')} />}
                            onChange={handleBrandsChange}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                    <TextField
                      fullWidth
                      label={t('products.name')}
                      value={searchText}
                      onChange={handleSearchTextChange}
                      onKeyDown={handleSearchTextKeyDown}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon icon={searchFill} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <FormControl required sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="demo-simple-select-required-label">Sắp xếp</InputLabel>
                            <Select
                              labelId="demo-simple-select-required-label"
                              id="demo-simple-select-required"
                              value={sortBy}
                              label="Sắp xếp *"
                              onChange={handleChangeSort}
                            >
                              {SORTBY.map(({ name, value }, index) => (
                                <MenuItem key={index} value={value}>
                                  {name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl required sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="demo-simple-select-required-label">Giá</InputLabel>
                            <Select
                              labelId="demo-simple-select-required-label"
                              id="demo-simple-select-required"
                              value={sortPrice}
                              label="Sắp xếp *"
                              onChange={handleChangeSortPrice}
                            >
                              {PRICE.map(({ name, value }, index) => (
                                <MenuItem key={index} value={value}>
                                  {name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Button variant="contained" color="primary" sx={{ paddingX: 5 }} onClick={handleSearch}>
                            {t('home.search')}
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {isLoadingProduct
                        ? 'Đang tìm kiếm'
                        : `Tìm thấy ${pagination?.total || 0}/${pagination?.countAll || 0} sản phẩm`}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
              <ProductList products={products} isLoading={isLoadingProduct} />
              {pagination?.hasNextPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <LoadingButton
                    variant="outlined"
                    sx={{ backgroundColor: 'white', width: '50%' }}
                    onClick={handleLoadMore}
                    loading={isLoadingProduct}
                  >
                    Xem thêm
                  </LoadingButton>
                </Box>
              )}
              {/*   <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={pagination?.totalPages}
                  size="large"
                  page={page}
                  variant="outlined"
                  shape="rounded"
                  onChange={handleChange}
                />
              </Box> */}
            </Box>
          </Stack>
        </Container>
      </ContentStyle>
    </Page>
  );
}
