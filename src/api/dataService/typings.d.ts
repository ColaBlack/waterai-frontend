declare namespace API {
  type BaseResponseEntityListVO = {
    code?: number;
    data?: EntityListVO;
    message?: string;
  };

  type BaseResponseFoodSamplingRecords2022VO = {
    code?: number;
    data?: FoodSamplingRecords2022VO;
    message?: string;
  };

  type BaseResponseFoodSamplingRecords2023VO = {
    code?: number;
    data?: FoodSamplingRecords2023VO;
    message?: string;
  };

  type BaseResponseFoodSamplingRecords2024VO = {
    code?: number;
    data?: FoodSamplingRecords2024VO;
    message?: string;
  };

  type BaseResponseMarketVO = {
    code?: number;
    data?: MarketVO;
    message?: string;
  };

  type BaseResponsePageEntityListVO = {
    code?: number;
    data?: PageEntityListVO;
    message?: string;
  };

  type BaseResponsePageFoodSamplingRecords2022VO = {
    code?: number;
    data?: PageFoodSamplingRecords2022VO;
    message?: string;
  };

  type BaseResponsePageFoodSamplingRecords2023VO = {
    code?: number;
    data?: PageFoodSamplingRecords2023VO;
    message?: string;
  };

  type BaseResponsePageFoodSamplingRecords2024VO = {
    code?: number;
    data?: PageFoodSamplingRecords2024VO;
    message?: string;
  };

  type BaseResponsePageMarketVO = {
    code?: number;
    data?: PageMarketVO;
    message?: string;
  };

  type EntityListRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    name?: string;
    nature?: string;
    city?: string;
    district?: string;
    address?: string;
    breedSpecies?: string;
    waterType?: string;
  };

  type EntityListVO = {
    id?: number;
    name?: string;
    nature?: string;
    city?: string;
    district?: string;
    address?: string;
    area?: number;
    breedSpecies?: string;
    waterType?: string;
  };

  type FoodSamplingRecords2022Request = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    sampledEntityName?: string;
    samplingLocation?: string;
    sampledProvince?: string;
    sampledCity?: string;
    sampledCountry?: string;
    sampledEntityAddress?: string;
    sampleName?: string;
    foodCategoryMajor?: string;
    foodCategorySub?: string;
    foodCategorySubSub?: string;
    foodCategoryDetail?: string;
    sampleType?: string;
    labelProducerName?: string;
    labelProducerAddress?: string;
    conclusion?: string;
    areaType?: string;
    producerProvince?: string;
    producerCity?: string;
    producerCounty?: string;
    reportCategory?: string;
    entrustedProvince?: string;
    entrustedCity?: string;
    entrustedCounty?: string;
    countryOfOrigin?: string;
    inspectionItem?: string;
    inspectionResult?: string;
    resultJudgment?: string;
    inspectionConclusion?: string;
  };

  type FoodSamplingRecords2022VO = {
    id?: number;
    sampledEntityName?: string;
    updateTime?: string;
    samplingLocation?: string;
    sampledProvince?: string;
    sampledCity?: string;
    sampledCountry?: string;
    sampledEntityAddress?: string;
    productionLicenseNo?: string;
    sampleName?: string;
    samplingNumber?: string;
    foodCategoryMajor?: string;
    foodCategorySub?: string;
    foodCategorySubSub?: string;
    foodCategoryDetail?: string;
    productionProcurementDate?: string;
    sampleSpecification?: string;
    sampleBatchNo?: string;
    manufactureDate?: string;
    shelfLifeDays?: string;
    samplingTime?: string;
    inspectionPurpose?: string;
    reportNumber?: string;
    sampleType?: string;
    packagingCategory?: string;
    labelProducerName?: string;
    labelProducerAddress?: string;
    samplingStage?: string;
    conclusion?: string;
    sampleStatus?: string;
    areaType?: string;
    producerProvince?: string;
    producerCity?: string;
    producerCounty?: string;
    businessLicenseNo?: string;
    reportCategory?: string;
    isEntrustedProduction?: string;
    entrustedProvince?: string;
    entrustedCity?: string;
    entrustedCounty?: string;
    countryOfOrigin?: string;
    inspectionItem?: string;
    inspectionResult?: string;
    inspectionBasis?: string;
    judgmentBasis?: string;
    standardMethodDetectionLimit?: string;
    standardDetectionLimitUnit?: string;
    methodDetectionLimit?: string;
    detectionLimitUnit?: string;
    standardMinAllowableLimit?: string;
    standardMinAllowableLimitUnit?: string;
    minAllowableLimit?: string;
    minAllowableLimitUnit?: string;
    inspectionConclusion?: string;
  };

  type FoodSamplingRecords2023Request = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    samplingLocation?: string;
    sampledProvince?: string;
    sampledCity?: string;
    sampledCountry?: string;
    sampleName?: string;
    foodCategoryMajor?: string;
    foodCategorySub?: string;
    foodCategorySubSub?: string;
    foodCategoryDetail?: string;
    sampleType?: string;
    conclusion?: string;
    areaType?: string;
    producerProvince?: string;
    producerCity?: string;
    producerCounty?: string;
    countryOfOrigin?: string;
    inspectionItem?: string;
    inspectionResult?: string;
  };

  type FoodSamplingRecords2023VO = {
    id?: number;
    samplingLocation?: string;
    sampledProvince?: string;
    sampledCity?: string;
    sampledCountry?: string;
    sampleName?: string;
    foodCategoryMajor?: string;
    foodCategorySub?: string;
    foodCategorySubSub?: string;
    foodCategoryDetail?: string;
    sampleSpecification?: string;
    manufactureDate?: string;
    shelfLifeDays?: string;
    samplingTime?: string;
    sampleType?: string;
    packagingCategory?: string;
    samplingStage?: string;
    conclusion?: string;
    executionStandard?: string;
    areaType?: string;
    producerProvince?: string;
    producerCity?: string;
    producerCounty?: string;
    unitPrice?: string;
    isImported?: string;
    countryOfOrigin?: string;
    inspectionItem?: string;
    inspectionResult?: string;
    inspectionBasis?: string;
    judgmentBasis?: string;
    standardMethodDetectionLimit?: string;
    standardDetectionLimitUnit?: string;
    methodDetectionLimit?: string;
    detectionLimitUnit?: string;
    standardMinAllowableLimit?: string;
    standardMinAllowableLimitUnit?: string;
    minAllowableLimit?: string;
    minAllowableLimitUnit?: string;
    standardMaxAllowableLimit?: string;
    standardMaxAllowableLimitUnit?: string;
    maxAllowableLimit?: string;
    maxAllowableLimitUnit?: string;
    resultJudgment?: string;
  };

  type FoodSamplingRecords2024Request = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    reportCategoryA?: string;
    reportCategoryB?: string;
    sampledEntityName?: string;
    samplingLocation?: string;
    sampledProvince?: string;
    sampledCity?: string;
    sampledCounty?: string;
    sampledEntityAddress?: string;
    licenseType?: string;
    samplingType?: string;
    labelProducerName?: string;
    labelProducerAddress?: string;
    producerProvince?: string;
    producerCity?: string;
    producerCounty?: string;
    entrustedProvince?: string;
    entrustedCity?: string;
    entrustedCounty?: string;
    entrustedEntityName?: string;
    entrustedEntityAddress?: string;
    entrustedEntityNature?: string;
    onlinePlatformName?: string;
    platformProvince?: string;
    platformCity?: string;
    platformCounty?: string;
    platformAddress?: string;
    sampleName?: string;
    foodCategoryMajor?: string;
    foodCategorySub?: string;
    foodCategorySubSub?: string;
    foodCategoryDetail?: string;
    sampleConclusion?: string;
    sampleAttribute?: string;
    countryOfOrigin?: string;
    samplingUnitName?: string;
    inspectionInstitutionName?: string;
    inspectionItem?: string;
    inspectionResult?: string;
    resultJudgment?: string;
  };

  type FoodSamplingRecords2024VO = {
    id?: number;
    reportCategoryA?: string;
    reportCategoryB?: string;
    taskSource?: string;
    sampledEntityName?: string;
    samplingLocation?: string;
    samplingStage?: string;
    sampledProvince?: string;
    sampledCity?: string;
    sampledCounty?: string;
    sampledEntityAddress?: string;
    areaType?: string;
    businessLicenseNo?: string;
    licenseType?: string;
    licenseNo?: string;
    samplingType?: string;
    productionLicenseNo?: string;
    labelProducerName?: string;
    labelProducerAddress?: string;
    producerContactPerson?: string;
    producerContactPhone?: string;
    producerProvince?: string;
    producerCity?: string;
    producerCounty?: string;
    entrustedProvince?: string;
    entrustedCity?: string;
    entrustedCounty?: string;
    entrustedEntityName?: string;
    entrustedEntityAddress?: string;
    entrustedProductionLicenseNo?: string;
    entrustedContactPerson?: string;
    entrustedContactPhone?: string;
    entrustedEntityNature?: string;
    onlinePlatformName?: string;
    platformBusinessLicenseNo?: string;
    platformPermitNo?: string;
    platformProvince?: string;
    platformCity?: string;
    platformCounty?: string;
    platformAddress?: string;
    sampleName?: string;
    foodCategoryMajor?: string;
    foodCategorySub?: string;
    foodCategorySubSub?: string;
    foodCategoryDetail?: string;
    sampleConclusion?: string;
    sampleAttribute?: string;
    countryOfOrigin?: string;
    samplingUnitName?: string;
    inspectionInstitutionName?: string;
    inspectionItem?: string;
    inspectionResult?: string;
    resultJudgment?: string;
    inspectionConclusion?: string;
    sampleSpecification?: string;
    sampleBatchNo?: string;
    manufactureDate?: string;
    shelfLifeDays?: string;
    samplingTime?: string;
    inspectionPurpose?: string;
    reportNumber?: string;
    sampleType?: string;
    packagingCategory?: string;
    samplingQuantity?: string;
    sampleStatus?: string;
    taskCategory?: string;
    inspectionRequirements?: string;
    inspectionBasis?: string;
    judgmentBasis?: string;
    standardMethodDetectionLimit?: string;
    standardDetectionLimitUnit?: string;
    methodDetectionLimit?: string;
    detectionLimitUnit?: string;
    standardMinAllowableLimit?: string;
    standardMinAllowableLimitUnit?: string;
    minAllowableLimit?: string;
    minAllowableLimitUnit?: string;
    standardMaxAllowableLimit?: string;
    standardMaxAllowableLimitUnit?: string;
    maxAllowableLimit?: string;
    maxAllowableLimitUnit?: string;
  };

  type get2022ByIdParams = {
    /** 记录ID */
    id: number;
  };

  type get2023ByIdParams = {
    /** 记录ID */
    id: number;
  };

  type get2024ByIdParams = {
    /** 记录ID */
    id: number;
  };

  type getEntityByIdParams = {
    /** 实体ID */
    id: number;
  };

  type getMarketByIdParams = {
    /** 市场ID */
    id: number;
  };

  type MarketRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    locationCity?: string;
    marketName?: string;
    locationCounty?: string;
    mainSalesCategory?: string;
    marketType?: string;
    wholesaleCategoryRange?: string;
    foodSource?: string;
    foodDestination?: string;
  };

  type MarketVO = {
    id?: number;
    locationCity?: string;
    marketName?: string;
    locationCounty?: string;
    mainSalesCategory?: string;
    transactionAmount?: number;
    marketType?: string;
    wholesaleCategoryRange?: string;
    boothCount?: number;
    hasTestingRoom?: string;
    foodSource?: string;
    foodDestination?: string;
  };

  type OrderItem = {
    column?: string;
    asc?: boolean;
  };

  type PageEntityListVO = {
    records?: EntityListVO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageEntityListVO;
    searchCount?: PageEntityListVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PageFoodSamplingRecords2022VO = {
    records?: FoodSamplingRecords2022VO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageFoodSamplingRecords2022VO;
    searchCount?: PageFoodSamplingRecords2022VO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PageFoodSamplingRecords2023VO = {
    records?: FoodSamplingRecords2023VO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageFoodSamplingRecords2023VO;
    searchCount?: PageFoodSamplingRecords2023VO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PageFoodSamplingRecords2024VO = {
    records?: FoodSamplingRecords2024VO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageFoodSamplingRecords2024VO;
    searchCount?: PageFoodSamplingRecords2024VO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PageMarketVO = {
    records?: MarketVO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageMarketVO;
    searchCount?: PageMarketVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };
}
