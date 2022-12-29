import React from "react";
import { Input, Button, Select, DatePicker, FormItem, FormContainer, Card, Notification, toast, InputGroup } from "components/ui";
import { HiMinus } from "react-icons/hi";
import dayjs from "dayjs";

import { Field, FieldArray, getIn, Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const optionsOwner = [
  { value: "Divisi Perencanaan", label: "Divisi Perencanaan" },
  { value: "Divisi Trisuri", label: "Divisi Trisuri" },
  { value: "Divisi Kredit", label: "Divisi Kredit" },
  { value: "Divisi Manajemen Risiko dan Kepatuhan", label: "Divisi Manajemen Risiko dan Kepatuhan" },
];

const { Addon } = InputGroup;

const optionsResource = [
  { value: "Galuh", label: "Galuh" },
  { value: "Mahendra", label: "Mahendra" },
  { value: "Fandy", label: "Fandy" },
  { value: "Shinta", label: "Shinta" },
  { value: "Dea", label: "Dea" },
  { value: "Anita", label: "Anita" },
  { value: "Adji", label: "Adji" },
  { value: "Trisno", label: "Trisno" },
  { value: "Bima", label: "Bima" },
  { value: "Candra", label: "Candra" },
  { value: "Ian", label: "Ian" },
  { value: "Brian", label: "Brian" },
  { value: "Qoirudin", label: "Qoirudin" },
  { value: "Yoga", label: "Yoga" },
  { value: "Resta", label: "Resta" },
  { value: "Heru", label: "Heru" },
  { value: "Vero", label: "Vero" },
  { value: "Roni", label: "Roni" },
  { value: "Ari", label: "Ari" },
];

const optionsPrefered = [
  { value: "red", label: <p className="text-red-500">Red</p> },
  { value: "orange", label: <p className="text-orange-500">Orange</p> },
  { value: "amber", label: <p className="text-amber-500">Amber</p> },
  { value: "yellow", label: <p className="text-yellow-500">Yellow</p> },
  { value: "lime", label: <p className="text-lime-500">Lime</p> },
  { value: "green ", label: <p className="text-green-500">Green</p> },
  { value: "emerald", label: <p className="text-emerald-500">Emerald</p> },
  { value: "teal", label: <p className="text-teal-500">Teal</p> },
  { value: "cyan", label: <p className="text-cyan-500">Cyan</p> },
  { value: "sky", label: <p className="text-sky-500">Sky</p> },
  { value: "blue", label: <p className="text-blue-500">Blue</p> },
  { value: "indigo", label: <p className="text-indigo-500">Indigo</p> },
  { value: "purple", label: <p className="text-purple-500">Purple</p> },
  { value: "fuchsia", label: <p className="text-fuchsia-500">Fuchsia</p> },
  { value: "pink", label: <p className="text-pink-500">Pink</p> },
  { value: "rose", label: <p className="text-rose-500">Rose</p> },
];

const openNotification = (type) => {
  toast.push(
    <Notification title={type.charAt(0).toUpperCase() + type.slice(1)} type={type}>
      Success Create a New Project!
    </Notification>
  );
};

const validationSchema = Yup.object().shape({
  project_no: Yup.string().min(13, "Too Short!").max(13, "Too Long!").required("Please input Project No!"),
  project_name: Yup.string().min(1, "Too Short!").max(255, "Too Long!").required("Please input Project Name"),
  project_owner: Yup.string().required("Please select one!"),
  project_start: Yup.date().required("Date Required!").nullable(),
  project_end: Yup.date().required("Date Required!").nullable(),
  project_prefered: Yup.string().required("Please select one!"),
  resources: Yup.array().min(1, "At least one is selected!"),

  tasks: Yup.array().of(
    Yup.object().shape({
      task_name: Yup.string().required("Please input Task Name!"),
      task_start: Yup.date().required("Date Required!").nullable(),
      task_end: Yup.date().required("Date Required!").nullable(),
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
  const navigate = useNavigate();
  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={{
          project_no: "",
          project_name: "",
          project_description: "",
          project_owner: "",
          project_status: "",
          project_start: null,
          project_end: null,
          project_prefered: "",
          resources: [],
          tasks: [
            {
              task_name: "",
              task_status: "",
              task_start: null,
              task_end: null,
            },
          ],
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          const dateNow = dayjs();
          const projectStart = values.project_start;
          const projectEnd = values.project_end;

          if (dateNow >= projectEnd) {
            values.project_status = "Expired";
          } else if (dateNow <= projectEnd && dateNow >= projectStart) {
            values.project_status = "Ongoing";
          } else {
            values.project_status = "New";
          }

          try {
            const response = fetch("http://localhost:5002/projects/create-project", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            });
            console.log(response);
            openNotification("success");
            alert(JSON.stringify(values, null, 2));
            // setSubmitting(false);
            // resetForm();
            // setTimeout(() => {
            //   navigate("/project/dashboard");
            // }, 1500);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        {({ values, touched, errors, resetForm }) => {
          const tasks = values.tasks;

          return (
            <Form>
              <FormContainer>
                {/* <div className="grid grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-5 mb-4"> */}
                <Card className="mb-4 col-span-1">
                  <h4 className="mb-4">Project Info</h4>
                  <div className="md:grid grid-cols-6 gap-4">
                    <FormItem className="col-span-1" label="Project No" asterisk invalid={errors.project_no && touched.project_no} errorMessage={errors.project_no}>
                      <Field type="text" name="project_no" placeholder="ITF-08-100123" component={Input} />
                    </FormItem>
                    <FormItem className="col-span-1" label="Project Name" asterisk invalid={errors.project_name && touched.project_name} errorMessage={errors.project_name}>
                      <Field type="text" name="project_name" placeholder="Name" component={Input} />
                    </FormItem>
                    <FormItem className="col-span-1" label="Project Owner" asterisk invalid={errors.project_owner && touched.project_owner} errorMessage={errors.project_owner}>
                      <Field name="project_owner">
                        {({ field, form }) => (
                          <Select field={field} form={form} options={optionsOwner} value={optionsOwner.filter((option) => option.value === values.project_owner)} onChange={(option) => form.setFieldValue(field.name, option.value)} />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem className="col-span-1" label="Project Prefered" asterisk invalid={errors.project_prefered && touched.project_prefered} errorMessage={errors.project_prefered}>
                      <Field name="project_prefered">
                        {({ field, form }) => (
                          <Select
                            field={field}
                            form={form}
                            options={optionsPrefered}
                            value={optionsPrefered.filter((option) => option.value === values.project_prefered)}
                            onChange={(option) => form.setFieldValue(field.name, option.value)}
                          />
                        )}
                      </Field>
                    </FormItem>
                    <InputGroup className="mb-4 col-span-2">
                      <FormItem label="Project Start" asterisk invalid={errors.project_start && touched.project_start} errorMessage={errors.project_start}>
                        <Field name="project_start" placeholder="Start Date">
                          {({ field, form }) => (
                            <DatePicker
                              placeholder="Start Date"
                              field={field}
                              form={form}
                              value={field.value}
                              maxDate={values.project_end}
                              onChange={(date) => {
                                form.setFieldValue(field.name, date);
                              }}
                            />
                          )}
                        </Field>
                      </FormItem>
                      <Addon>To</Addon>
                      <FormItem label="Project End" asterisk invalid={errors.project_end && touched.project_end} errorMessage={errors.project_end}>
                        <Field name="project_end" placeholder="End Date">
                          {({ field, form }) => (
                            <DatePicker
                              placeholder="End Date"
                              field={field}
                              form={form}
                              value={field.value}
                              minDate={values.project_start}
                              onChange={(date) => {
                                form.setFieldValue(field.name, date);
                              }}
                            />
                          )}
                        </Field>
                      </FormItem>
                    </InputGroup>
                  </div>
                  <FormItem label="Project Description" invalid={errors.project_description && touched.project_description} errorMessage={errors.project_description}>
                    <Field type="text" name="project_description" placeholder="" component={Input} textArea />
                  </FormItem>

                  <FormItem label="Project Resources" asterisk invalid={errors.resources && touched.resources} errorMessage={errors.resources}>
                    <Field name="resources">
                      {({ field, form }) => (
                        <Select
                          //componentAs={CreatableSelect}
                          isMulti
                          field={field}
                          form={form}
                          options={optionsResource}
                          value={values.resources}
                          onChange={(option) => {
                            form.setFieldValue(field.name, option);
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                </Card>

                <Card className="mb-4 col-span-3">
                  <h4 className="mb-4">Project Tasks</h4>
                  <FormContainer>
                    <FieldArray name="tasks">
                      {({ form, remove, push }) => (
                        <div>
                          {tasks && tasks.length > 0
                            ? tasks.map((_, index) => {
                                const taskNameFeedBack = fieldFeedback(form, `tasks[${index}].task_name`);
                                const taskStartFeedBack = fieldFeedback(form, `tasks[${index}].task_start`);
                                const taskEndFeedBack = fieldFeedback(form, `tasks[${index}].task_end`);

                                const dateNow = dayjs();
                                const taskStart = tasks[index].task_start;
                                const taskEnd = tasks[index].task_end;

                                if (dateNow >= taskEnd) {
                                  tasks[index].task_status = "Completed";
                                } else if (dateNow <= taskEnd && dateNow >= taskStart) {
                                  tasks[index].task_status = "Ongoing";
                                } else {
                                  tasks[index].task_status = "New";
                                }

                                return (
                                  <div key={index}>
                                    <div className="md:grid grid-cols-3 gap-4">
                                      <FormItem className="col-span-1" label="Task Name" invalid={taskNameFeedBack.invalid} errorMessage={taskNameFeedBack.errorMessage}>
                                        <Field invalid={taskNameFeedBack.invalid} placeholder="Name" name={`tasks[${index}].task_name`} type="text" component={Input} />
                                      </FormItem>
                                      <InputGroup className="col-span-2">
                                        <FormItem label="Task Start" invalid={taskStartFeedBack.invalid} errorMessage={taskStartFeedBack.errorMessage}>
                                          <Field invalid={taskStartFeedBack.invalid} name={`tasks[${index}].task_start`}>
                                            {({ field, form }) => (
                                              <DatePicker
                                                placeholder="Start Date"
                                                field={field}
                                                form={form}
                                                value={field.value}
                                                minDate={values.project_start}
                                                maxDate={tasks[index].task_end || values.project_end}
                                                onChange={(date) => {
                                                  form.setFieldValue(field.name, date);
                                                }}
                                              />
                                            )}
                                          </Field>
                                        </FormItem>
                                        <Addon>To</Addon>
                                        <FormItem label="Task End" invalid={taskEndFeedBack.invalid} errorMessage={taskEndFeedBack.errorMessage}>
                                          <Field invalid={taskEndFeedBack.invalid} name={`tasks[${index}].task_end`}>
                                            {({ field, form }) => (
                                              <DatePicker
                                                placeholder="End Date"
                                                field={field}
                                                form={form}
                                                value={field.value}
                                                minDate={tasks[index].task_start || values.project_start}
                                                maxDate={values.project_end}
                                                onChange={(date) => {
                                                  form.setFieldValue(field.name, date);
                                                }}
                                              />
                                            )}
                                          </Field>
                                        </FormItem>
                                        <div className="ml-3">
                                          <Button shape="circle" size="sm" icon={<HiMinus />} onClick={() => remove(index)} />
                                        </div>
                                      </InputGroup>
                                    </div>
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
                {/* </div> */}
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
