import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/layout/ProtectedRoute";

import AuthLayout from "../components/layout/AuthLayout";
import MainLayout from "../components/layout/MainLayout";

/* ========= AUTH ========= */
import Login from "../pages/auth/Login";

/* ========= ADMIN ========= */
import AdminDashboard from "../Nootaayo/AdminDashboard";
import Reception from "../Nootaayo/Reception"
import ViewAgreements from "../Nootaayo/ViewAgreements";
import Reports from "../Nootaayo/Reports"
import Users from "../Nootaayo/Users"
import AgreementDetails from "../Nootaayo/ViewAgreementDetails";
/* ========= USER ========= */

import UserDashboard from "../Nootaayo/AdminDashboard";
import UserReception from "../Nootaayo/Reception"
import UserViewAgreements from "../Nootaayo/ViewAgreements";
import userAgreementDetails from "../Nootaayo/ViewAgreementDetails";

import UserReports from "../Nootaayo/Reports"
import ForgotPassword from "../pages/auth/ForgotPassword";
import CheckEmail from "../pages/auth/CheckEmail";
import ResetPassword from "../pages/auth/ResetPassword";
import ChangePassword from "../pages/auth/ChangePassword";
import RefNoSetting from "../Nootaayo/RefNoSetting";
import Settings from "../Nootaayo/Settings";
import NotoryList from "../Nootaayo/NotoryList";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* ===== AUTH ===== */}
                <Route
                    path="/login"
                    element={
                        <AuthLayout>
                            <Login />
                        </AuthLayout>
                    }
                />
                <Route
                    path="/forgotpassword"
                    element={
                        <AuthLayout>
                            <ForgotPassword />
                        </AuthLayout>
                    }


                />
                <Route
                    path="/reset-password/:token"
                    element={
                        <AuthLayout>
                            <ResetPassword />
                        </AuthLayout>
                    }
                />


                <Route
                    path="/check-email"
                    element={
                        <AuthLayout>
                            <CheckEmail />
                        </AuthLayout>
                    }
                />
                <Route
                    path="/change-password"
                    element={
                        <ProtectedRoute roles={["ADMIN", "USER"]}>
                            <MainLayout>
                                <ChangePassword />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* ===== ADMIN ===== */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute roles={["ADMIN", "USER", "SUPER_ADMIN"]}>
                            <MainLayout>
                                <AdminDashboard />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/Reception"
                    element={
                        <ProtectedRoute roles={[ "SUPER_ADMIN" ,"ADMIN", "USER"]}>
                            <MainLayout>
                                <Reception />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/viewAgreements"
                    element={
                        <ProtectedRoute roles={["SUPER_ADMIN","ADMIN", "USER"]}>
                            <MainLayout>
                                <ViewAgreements />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/agreement/:id"
                    element={
                        <ProtectedRoute roles={[ "SUPER_ADMIN" ,"ADMIN", "USER"]}>
                            <MainLayout>
                                <AgreementDetails />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/reports"
                    element={
                        <ProtectedRoute roles={[ "SUPER_ADMIN" ,"ADMIN", "USER"]}>
                            <MainLayout>
                                <Reports />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/settings"
                    element={
                        <ProtectedRoute roles={[ "SUPER_ADMIN" ,"ADMIN"]}>
                            <MainLayout>
                                <RefNoSetting />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/documents"
                    element={
                        <ProtectedRoute roles={[ "SUPER_ADMIN" ]}>
                            <MainLayout>
                                <Settings />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/notoryList"
                    element={
                        <ProtectedRoute roles={["SUPER_ADMIN","ADMIN"]}>
                            <MainLayout>
                                <NotoryList />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute roles={[ "SUPER_ADMIN","ADMIN"]}>
                            <MainLayout>
                                <Users />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />





                {/* ===== USER ===== */}
                <Route
                    path="/user"
                    element={
                        <ProtectedRoute roles={["USER"]}>
                            <MainLayout>
                                <UserDashboard />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/user/Reception"
                    element={
                        <ProtectedRoute roles={["USER"]}>
                            <MainLayout>
                                <UserReception />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/user/viewAgreements"
                    element={
                        <ProtectedRoute roles={["USER"]}>
                            <MainLayout>
                                <UserViewAgreements />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/agreement/:id"
                    element={
                        <ProtectedRoute roles={["USER"]}>
                            <MainLayout>
                                <userAgreementDetails />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/reports"
                    element={
                        <ProtectedRoute roles={["ADMIN", "USER"]}>
                            <MainLayout>
                                <UserReports />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />




                {/* ===== DEFAULT ===== */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;