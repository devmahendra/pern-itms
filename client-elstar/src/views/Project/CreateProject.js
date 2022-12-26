import React from "react";
import { Input, Button, Select, DatePicker, Radio, FormItem, FormContainer, Card } from "components/ui";
import { HiMinus } from "react-icons/hi";

import { Field, FieldArray, getIn, Form, Formik } from "formik";
import * as Yup from "yup";

const optionsOwner = [
  { value: "Divisi Perencanaan", label: "Divisi Perencanaan" },
  { value: "Divisi Trisuri", label: "Divisi Trisuri" },
  { value: "Divisi Kredit", label: "Divisi Kredit" },
  { value: "Divisi Manajemen Risiko dan Kepatuhan", label: "Divisi Manajemen Risiko dan Kepatuhan" },
];

const optionsStatus = [
  { value: "New", label: "New" },
  { value: "Ongoing", label: "Ongoing" },
  { value: "Expired", label: "Expired" },
  { value: "Completed", label: "Completed" },
];

const validationSchema = Yup.object().shape({
  project_no: Yup.string().min(13, "Too Short!").max(13, "Too Long!").required("Please input Project No!"),
  project_name: Yup.string().min(1, "Too Short!").max(255, "Too Long!").required("Please input Project Name"),
  project_owner: Yup.string().required("Please select one!"),
  project_priority: Yup.string().required("Please select one!"),
  project_status: Yup.string().required("Please select one!"),
  project_start: Yup.date().required("Date Required!").nullable(),
  project_end: Yup.date().required("Date Required!").nullable(),
  tasks: Yup.array().of(
    Yup.object().shape({
      task_name: Yup.string().required("Please input Task Name!"),
      task_status: Yup.string().required("Please select one!"),
      task_start: Yup.date().required("Date Required!").nullable(),
      task_end: Yup.date().required("Date Required!").nullable(),
    })
  ),
  resources: Yup.array().of(
    Yup.object().shape({
      resource_name: Yup.string().required("Please input Task Name!"),
      resource_position: Yup.string().required("Please select one!"),
    })
  ),
});

const fieldFeedback = (form, name) => {
  const error = getIn(form.errors, name);
  const touch = getIn(form.touched, name);
  return {
    errorMessage: error || "",
    invalid: typeof touch === "undefined" ? false : error && touch,
  };
};

const CreateProject = () => {
  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={{
          project_no: "",
          project_name: "",
          project_description: "",
          project_owner: "",
          project_priority: "",
          project_status: "",
          project_start: null,
          project_end: null,
          tasks: [
            {
              task_name: "",
              task_status: "",
              task_start: null,
              task_end: null,
            },
          ],
          resources: [
            {
              resource_name: "",
              resource_position: "",
            },
          ],
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log("values", values);
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ values, touched, errors, resetForm }) => {
          const tasks = values.tasks;
          const resources = values.resources;
          return (
            <Form>
              <FormContainer>
                <div className="grid grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-5 mb-4">
                  <Card className="mb-4 col-span-1">
                    <h4 className="mb-4">Project Info</h4>
                    <FormItem label="Project No" asterisk invalid={errors.project_no && touched.project_no} errorMessage={errors.project_no}>
                      <Field type="text" name="project_no" placeholder="ITF-08-100123" component={Input} />
                    </FormItem>
                    <FormItem label="Project Name" asterisk invalid={errors.project_name && touched.project_name} errorMessage={errors.project_name}>
                      <Field type="text" name="project_name" placeholder="" component={Input} />
                    </FormItem>
                    <FormItem label="Project Description" invalid={errors.project_description && touched.project_description} errorMessage={errors.project_description}>
                      <Field type="text" name="project_description" placeholder="" component={Input} textArea />
                    </FormItem>
                    <FormItem label="Project Owner" asterisk invalid={errors.project_owner && touched.project_owner} errorMessage={errors.project_owner}>
                      <Field name="project_owner">
                        {({ field, form }) => (
                          <Select field={field} form={form} options={optionsOwner} value={optionsOwner.filter((option) => option.value === values.project_owner)} onChange={(option) => form.setFieldValue(field.name, option.value)} />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Project Priority" asterisk invalid={errors.project_priority && touched.project_priority} errorMessage={errors.project_priority}>
                      <Field name="project_priority">
                        {({ field, form }) => (
                          <Radio.Group value={values.project_priority} onChange={(val) => form.setFieldValue(field.name, val)}>
                            <Radio value="Urgent">Urgent</Radio>
                            <Radio value="High">High</Radio>
                            <Radio value="Medium">Medium</Radio>
                            <Radio value="Low">Low</Radio>
                          </Radio.Group>
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Project Status" asterisk invalid={errors.project_status && touched.project_status} errorMessage={errors.project_status}>
                      <Field name="project_status">
                        {({ field, form }) => (
                          <Select field={field} form={form} options={optionsStatus} value={optionsStatus.filter((option) => option.value === values.project_status)} onChange={(option) => form.setFieldValue(field.name, option.value)} />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Project Start" asterisk invalid={errors.project_start && touched.project_start} errorMessage={errors.project_start}>
                      <Field name="project_start" placeholder="Start Date">
                        {({ field, form }) => (
                          <DatePicker
                            field={field}
                            form={form}
                            value={field.value}
                            onChange={(date) => {
                              form.setFieldValue(field.name, date);
                            }}
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Project End" asterisk invalid={errors.project_end && touched.project_end} errorMessage={errors.project_end}>
                      <Field name="project_end" placeholder="End Date">
                        {({ field, form }) => (
                          <DatePicker
                            field={field}
                            form={form}
                            value={field.value}
                            onChange={(date) => {
                              form.setFieldValue(field.name, date);
                            }}
                          />
                        )}
                      </Field>
                    </FormItem>
                  </Card>
                  <div className="col-span-3">
                    <Card className="mb-4 col-span-3">
                      <h4 className="mb-4">Project Tasks</h4>
                      <FormContainer layout="inline">
                        <FieldArray name="tasks">
                          {({ form, remove, push }) => (
                            <div>
                              {tasks && tasks.length > 0
                                ? tasks.map((_, index) => {
                                    const taskNameFeedBack = fieldFeedback(form, `tasks[${index}].task_name`);
                                    const taskStatusFeedBack = fieldFeedback(form, `tasks[${index}].task_status`);
                                    const taskStartFeedBack = fieldFeedback(form, `tasks[${index}].task_start`);
                                    const taskEndFeedBack = fieldFeedback(form, `tasks[${index}].task_end`);

                                    return (
                                      <div key={index}>
                                        <FormItem label="Name" invalid={taskNameFeedBack.invalid} errorMessage={taskNameFeedBack.errorMessage}>
                                          <Field invalid={taskNameFeedBack.invalid} placeholder="Task Name" name={`tasks[${index}].task_name`} type="text" component={Input} />
                                        </FormItem>
                                        <FormItem label="Status" invalid={taskStatusFeedBack.invalid} errorMessage={taskStatusFeedBack.errorMessage}>
                                          <Field invalid={taskStatusFeedBack.invalid} placeholder="Task Name" name={`tasks[${index}].task_status`} type="text" component={Input} />
                                        </FormItem>
                                        <FormItem label="Start" invalid={taskStartFeedBack.invalid} errorMessage={taskStartFeedBack.errorMessage}>
                                          <Field invalid={taskStartFeedBack.invalid} name={`tasks[${index}].task_start`}>
                                            {({ field, form }) => (
                                              <DatePicker
                                                field={field}
                                                form={form}
                                                value={field.value}
                                                onChange={(date) => {
                                                  form.setFieldValue(field.name, date);
                                                }}
                                              />
                                            )}
                                          </Field>
                                        </FormItem>
                                        <FormItem label="End" invalid={taskEndFeedBack.invalid} errorMessage={taskEndFeedBack.errorMessage}>
                                          <Field invalid={taskEndFeedBack.invalid} name={`tasks[${index}].task_end`}>
                                            {({ field, form }) => (
                                              <DatePicker
                                                field={field}
                                                form={form}
                                                value={field.value}
                                                onChange={(date) => {
                                                  form.setFieldValue(field.name, date);
                                                }}
                                              />
                                            )}
                                          </Field>
                                        </FormItem>

                                        <Button shape="circle" size="sm" icon={<HiMinus />} onClick={() => remove(index)} />
                                      </div>
                                    );
                                  })
                                : null}
                              <div>
                                <Button
                                  type="button"
                                  className="ltr:mr-2 rtl:ml-2"
                                  onClick={() => {
                                    push({ task_name: "", task_status: "", task_start: "", task_end: "" });
                                  }}
                                >
                                  Add a Task
                                </Button>
                              </div>
                            </div>
                          )}
                        </FieldArray>
                      </FormContainer>
                    </Card>
                    <Card className="mb-4 col-span-3">
                      <h4 className="mb-4">Project Resources</h4>
                      <FormContainer layout="inline">
                        <FieldArray name="resources">
                          {({ form, remove, push }) => (
                            <div>
                              {resources && resources.length > 0
                                ? resources.map((_, index) => {
                                    const resourceNameFeedBack = fieldFeedback(form, `resources[${index}].resource_name`);
                                    const resourcePositionFeedBack = fieldFeedback(form, `resources[${index}].resource_position`);

                                    return (
                                      <div key={index}>
                                        <FormItem label="Name" invalid={resourceNameFeedBack.invalid} errorMessage={resourceNameFeedBack.errorMessage}>
                                          <Field invalid={resourceNameFeedBack.invalid} placeholder="Task Name" name={`resources[${index}].resource_name`} type="text" component={Input} />
                                        </FormItem>
                                        <FormItem label="" invalid={resourcePositionFeedBack.invalid} errorMessage={resourcePositionFeedBack.errorMessage}>
                                          <Field invalid={resourcePositionFeedBack.invalid} name={`resources[${index}].resource_position`}>
                                            {({ field, form }) => (
                                              <Radio.Group value={values.resourcePositionFeedBack} onChange={(val) => form.setFieldValue(field.name, val)}>
                                                <Radio value="Planner">Planner</Radio>
                                                <Radio value="Developer">Developer</Radio>
                                                <Radio value="Quality Assurance">Quality Assurance</Radio>
                                              </Radio.Group>
                                            )}
                                          </Field>
                                        </FormItem>

                                        <Button shape="circle" size="sm" icon={<HiMinus />} onClick={() => remove(index)} />
                                      </div>
                                    );
                                  })
                                : null}
                              <div>
                                <Button
                                  type="button"
                                  className="ltr:mr-2 rtl:ml-2"
                                  onClick={() => {
                                    push({ resource_name: "", resource_position: "" });
                                  }}
                                >
                                  Add a Resource
                                </Button>
                              </div>
                            </div>
                          )}
                        </FieldArray>
                      </FormContainer>
                    </Card>
                  </div>
                </div>
                <FormItem>
                  <Button type="reset" className="ltr:mr-2 rtl:ml-2" onClick={resetForm}>
                    Reset
                  </Button>
                  <Button variant="solid" type="submit">
                    Submit
                  </Button>
                </FormItem>
              </FormContainer>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default CreateProject;
