const Input = ({ setFormData, formData, placeHolder }) => {
  return (
    <input
      onChange={(e) => setFormData({ ...formData, dueDays: e.target.value })}
      placeholder={placeHolder}
      value={formData.dueDays}
    />
  );
};
export default Input;
