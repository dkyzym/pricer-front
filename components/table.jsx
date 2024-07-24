// eslint-disable-next-line react/prop-types
export const Maintbl = ({ htmlContent }) => {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};
