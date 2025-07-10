/**
 * 接口详情
 */
export interface YApiInterfaceDetail {
  _id: number;
  title: string;
  path: string;
  method: string;
  desc: string;
  req_params?: Array<{
    name: string;
    desc: string;
    required: boolean;
  }>;
  req_query: Array<{
    name: string;
    desc: string;
    required: string;
    _id: string;
    example: string;
  }>;
  req_body_other?: string;
  res_body?: string;
  project_id: number;
  catid: number;
  uid: number;
  add_time: number;
  up_time: number;
  index: number;
  status: string;
  type: string;
  req_body_type: string;
  res_body_type: string;
  req_body_form?: Array<{
    name: string;
    desc: string;
    type: string;
    required: boolean;
  }>;
  req_headers?: Array<{
    name: string;
    value: string;
    desc: string;
  }>;
  res_body_is_json_schema?: boolean;
  req_body_is_json_schema?: boolean;
}