import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { experimentalStyled as styled, useTheme } from '@material-ui/core/styles';
import {
  Card,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  FormHelperText,
  Link,
  Button
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { QuillEditor } from '../../../components/editor';
import { PATH_DASHBOARD } from '../../../routes/paths';
import useLocales from '../../../hooks/useLocales';
import { getAllBrands } from '../../../redux/slices/brandSlice';
import { getAllCategories } from '../../../redux/slices/categorySlice';
import { getProductById, updateProduct } from '../../../redux/slices/productSlice';
// ----------------------------------------------------------------------

const TAGS_OPTION = [
  'Toy Story 3',
  'Logan',
  'Full Metal Jacket',
  'Dangal',
  'The Sting',
  '2001: A Space Odyssey',
  "Singin' in the Rain",
  'Toy Story',
  'Bicycle Thieves',
  'The Kid',
  'Inglourious Basterds',
  'Snatch',
  '3 Idiots'
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

PageProductEdit.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object
};

export default function PageProductEdit() {
  const { t } = useLocales();
  const navigate = useNavigate();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { item: currentProduct } = useSelector((state) => state.product);
  const { list: brandsList } = useSelector((state) => state.brand);
  const { list: categoriesList } = useSelector((state) => state.category);
  const [policies, setPolicies] = useState([]);
  const [isErrorPolicies, setIsErrorPolicies] = useState(false);

  useEffect(() => {
    dispatch(getAllBrands());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getProductById(id));
  }, [id]);

  const handleSave = () => {
    const productData = handleAddDataForProduct();
    if (currentProduct) {
      dispatch(updateProduct(currentProduct._id, productData));
      enqueueSnackbar(`Update product ${currentProduct.name} successfully!`, {
        variant: 'success'
      });
      navigate(PATH_DASHBOARD.app.products.list);
    }
  };

  const handleAddDataForProduct = () => {
    const product = {
      name: values.name,
      desc: values.description,
      warrantyPeriod: values.warrantyPeriod,
      origin: values?.origin.label,
      brandId: values.brand,
      categoryId: values.category,
      tags: values.tags,
      video: values.video
    };
    return product;
  };

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required(t('products.name-validation')),
    description: Yup.string().required(t('products.desc-validation')),
    warrantyPeriod: Yup.number()
      .required(t('products.warranty-period-validation'))
      .min(0, t('products.warranty-period-validation1'))
      .max(60, t('products.warranty-period-validation2')),
    brand: Yup.string().required(t('products.brand-validation')),
    category: Yup.string().required(t('products.category-validation'))
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentProduct?.name || '',
      description: currentProduct?.desc || '',
      warrantyPeriod: currentProduct?.warrantyPeriod || 12,
      origin: currentProduct?.origin || '',
      brand: currentProduct?.brand?._id || '',
      category: currentProduct?.category?._id || '',
      tags: currentProduct?.tags || [TAGS_OPTION[0]],
      video: currentProduct?.video || '',
      policies: currentProduct?.policies || []
    },
    validationSchema: NewProductSchema,
    onSubmit: async () => {
      handleSave();
    }
  });
  const handleRemoveFields = (id) => {
    const values = [...policies];
    values.splice(
      values.findIndex((value) => value.id === id),
      1
    );
    setPolicies(values);
  };
  const handleAddFields = () => {
    const indexCurrent = policies.length - 1;
    if (policies[indexCurrent].name === '' || policies[indexCurrent].value === '') {
      setIsErrorPolicies(true);
      return;
    }
    setPolicies([...policies, { id: policies.length + 1, name: '', value: '' }]);
  };
  const renderSpecificationsForm = () => (
    <div>
      {values?.policies.map((value, index) => (
        <Stack key={index} direction="row" spacing={3} sx={{ marginBottom: theme.spacing(2) }}>
          <TextField
            fullWidth
            name="name"
            label={t('products.specifications-name')}
            size="small"
            value={value}
            error={isErrorPolicies && value === ''}
          />
          <TextField
            fullWidth
            name="value"
            label={t('products.specifications-value')}
            size="small"
            value={value}
            error={isErrorPolicies && value === ''}
          />
          <Button disabled={policies.length === 1} onClick={() => handleRemoveFields(value)}>
            Xóa
          </Button>
        </Stack>
      ))}
      {isErrorPolicies && (
        <Typography
          variant="inherit"
          sx={{
            marginLeft: theme.spacing(1),
            marginBottom: theme.spacing(1),
            fontSize: 'small',
            color: theme.palette.error.main
          }}
        >
          Specifications must be filled in completely !!!
        </Typography>
      )}
    </div>
  );
  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;
  console.log('errors: ', errors);

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off">
        <Stack direction="row" spacing={3} sx={{ justifyContent: 'space-between', marginBottom: theme.spacing(2) }}>
          <Typography variant="h4" gutterBottom>
            {t('products.general-info')}
          </Typography>
        </Stack>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label={t('products.name')}
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <div>
                    <LabelStyle>{t('products.desc')}</LabelStyle>
                    <QuillEditor
                      simple
                      id="product-description"
                      value={values.description}
                      onChange={(val) => setFieldValue('description', val)}
                      error={Boolean(touched.description && errors.description)}
                    />
                    {touched.description && errors.description && (
                      <FormHelperText error sx={{ px: 2 }}>
                        {touched.description && errors.description}
                      </FormHelperText>
                    )}
                  </div>
                  <Card sx={{ p: 3 }}>
                    {renderSpecificationsForm()}
                    <Button variant="outlined" onClick={handleAddFields}>
                      Thêm
                    </Button>
                  </Card>
                  <TextField fullWidth label={t('products.video')} {...getFieldProps('video')} />
                </Stack>
              </Card>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    type="number"
                    fullWidth
                    label={t('products.warranty-period')}
                    {...getFieldProps('warrantyPeriod')}
                    defaultValue={12}
                    error={Boolean(touched.warrantyPeriod && errors.warrantyPeriod)}
                    helperText={touched.warrantyPeriod && errors.warrantyPeriod}
                  />
                  {/* <Autocomplete */}
                  {/*  required */}
                  {/*  fullWidth */}
                  {/*  // defaultValue={{ code: 'CN', label: 'China', phone: '86' }} */}
                  {/*  defaultValue={countries.find((c) => c.label === currentProduct.origin)} */}
                  {/*  options={countries.map((country) => ({ */}
                  {/*    label: country.label */}
                  {/*  }))} */}
                  {/*  onChange={(event, label) => { */}
                  {/*    setFieldValue('origin', label); */}
                  {/*  }} */}
                  {/*  getOptionLabel={(option) => option.label} */}
                  {/*  renderInput={(params) => <TextField {...params} label="Origin" margin="none" />} */}
                  {/* /> */}
                  {currentProduct?.brand?.name !== undefined && (
                    <Autocomplete
                      required
                      fullWidth
                      defaultValue={currentProduct.brand}
                      options={brandsList.filter((x) => !x.isHide && x._id !== currentProduct?.brand)}
                      getOptionLabel={(option) => option.name}
                      value={brandsList.find((c) => c.slug === currentProduct?.brand)}
                      onChange={(e, newValue) => {
                        setFieldValue('brand', newValue?._id);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('products.brand')}
                          margin="none"
                          error={Boolean(errors.brand)}
                          helperText={errors.brand}
                        />
                      )}
                      error={Boolean(errors.brand)}
                    />
                  )}
                  <Link to={PATH_DASHBOARD.app.brands} color="inherit" component={RouterLink}>
                    <Typography
                      variant="inherit"
                      sx={{
                        marginTop: theme.spacing(-2),
                        marginLeft: theme.spacing(1),
                        fontSize: 'small'
                      }}
                    >
                      <Typography component="a" variant="subtitle4" sx={{ color: 'primary.main' }}>
                        &nbsp;{t('products.brand-add')}
                      </Typography>
                    </Typography>
                  </Link>

                  {currentProduct?.category?.name !== undefined && (
                    <Autocomplete
                      fullWidth
                      defaultValue={currentProduct.category}
                      options={categoriesList.filter((x) => !x.isHide && x._id !== currentProduct?.category)}
                      getOptionLabel={(option) => option.name}
                      value={categoriesList.find((c) => c.slug === currentProduct?.category)}
                      onChange={(e, newValue) => {
                        setFieldValue('category', newValue?._id);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('products.category')}
                          margin="none"
                          error={Boolean(errors.category)}
                          helperText={errors.category}
                        />
                      )}
                      error={Boolean(errors.category)}
                    />
                  )}
                  <Link to={PATH_DASHBOARD.app.categories} color="inherit" component={RouterLink}>
                    <Typography
                      variant="inherit"
                      sx={{
                        marginTop: theme.spacing(-2),
                        marginLeft: theme.spacing(1),
                        fontSize: 'small'
                      }}
                    >
                      <Typography component="a" variant="subtitle4" sx={{ color: 'primary.main' }}>
                        &nbsp;{t('products.category-add')}
                      </Typography>
                    </Typography>
                  </Link>
                  <Autocomplete
                    multiple
                    freeSolo
                    value={values.tags}
                    onChange={(event, newValue) => {
                      setFieldValue('tags', newValue);
                    }}
                    options={TAGS_OPTION.map((option) => option)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip key={option} size="small" label={option} {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => <TextField label="Tags" {...params} />}
                  />
                </Stack>
              </Card>
              <Button fullWidth variant="contained" size="large" onClick={handleSubmit}>
                {t('products.save')}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
